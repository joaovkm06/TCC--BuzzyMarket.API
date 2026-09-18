
import { Types } from 'mongoose';

import * as carrinhoRepository
  from '../repository/CarrinhoRepository';

import * as userRepository
  from '../repository/UserRepository';

import * as produtoRepository
  from '../repository/ProdutoRepository';

import { UserProfile } from '../model/usuario';

import { AppError } from '../error/AppError';


// =====================================================
// ADICIONAR ITEM
// =====================================================

export async function adicionarItem(
  usuarioId: string,
  produtoId: string,
  quantidade: number
) {

  // ---------------------------------------------------
  // VALIDAÇÕES
  // ---------------------------------------------------

  if (!usuarioId) {

    throw new AppError(
      'usuarioId é obrigatório.'
    );

  }

  if (!produtoId) {

    throw new AppError(
      'produtoId é obrigatório.'
    );

  }

  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw new AppError(
      'usuarioId inválido.'
    );

  }

  if (
    !Types.ObjectId.isValid(produtoId)
  ) {

    throw new AppError(
      'produtoId inválido.'
    );

  }

  if (
    quantidade === undefined ||
    quantidade === null ||
    !Number.isInteger(quantidade) ||
    quantidade < 1
  ) {

    throw new AppError(
      'A quantidade deve ser um número inteiro maior que zero.'
    );

  }


  // ---------------------------------------------------
  // VERIFICAR USUÁRIO
  // ---------------------------------------------------

  const usuario =
    await userRepository
      .buscarUsuarioSemPopulate(
        usuarioId
      );

  if (!usuario) {

    throw new AppError(
      'Usuário não encontrado.',
      404
    );

  }

  if (
    usuario.perfil !==
    UserProfile.Cliente
  ) {

    throw new AppError(
      'Apenas clientes podem utilizar o carrinho.'
    );

  }


  // ---------------------------------------------------
  // VERIFICAR PRODUTO
  // ---------------------------------------------------

  const produto =
    await produtoRepository
      .buscarProdutoSemPopulate(
        produtoId
      );

  if (!produto) {

    throw new AppError(
      'Produto não encontrado.',
      404
    );

  }

  if (!produto.ativo) {

    throw new AppError(
      'Este produto está inativo.'
    );

  }

  if (
    produto.estoque < quantidade
  ) {

    const error =
      new AppError(
        `Estoque insuficiente. Estoque disponível: ${produto.estoque}.`
      );

    error.estoqueDisponivel =
      produto.estoque;

    error.quantidadeSolicitada =
      quantidade;

    throw error;

  }


  // ---------------------------------------------------
  // BUSCAR CARRINHO
  // ---------------------------------------------------

  let carrinho =
    await carrinhoRepository
      .buscarCarrinhoSemPopulate(
        usuarioId
      );


  // ---------------------------------------------------
  // CRIAR CARRINHO
  // ---------------------------------------------------

  if (!carrinho) {

    carrinho =
      await carrinhoRepository
        .criarCarrinho({

          usuarioId:
            new Types.ObjectId(
              usuarioId
            ),

          itens: [

            {

              produtoId:
                produto._id,

              nome:
                produto.nome,

              preco:
                produto.preco,

              imagem:
                produto.imagem,

              quantidade

            }

          ]

        });


    return await carrinhoRepository
      .buscarCarrinhoPorUsuario(
        usuarioId
      );

  }


  // ---------------------------------------------------
  // VERIFICAR SE JÁ EXISTE
  // ---------------------------------------------------

  const itemExistente =
    carrinho.itens.find(

      (item: any) =>
        String(item.produtoId) ===
        String(produtoId)

    );


  // ---------------------------------------------------
  // PRODUTO JÁ EXISTE
  // ---------------------------------------------------

  if (itemExistente) {

    const novaQuantidade =
      itemExistente.quantidade +
      quantidade;


    if (
      novaQuantidade >
      produto.estoque
    ) {

      const error =
        new AppError(
          `Quantidade solicitada ultrapassa o estoque. Estoque disponível: ${produto.estoque}.`
        );

      error.estoqueDisponivel =
        produto.estoque;

      error.quantidadeSolicitada =
        novaQuantidade;

      throw error;

    }


    return await carrinhoRepository
      .atualizarItem(

        usuarioId,

        produtoId,

        novaQuantidade

      );

  }


  // ---------------------------------------------------
  // NOVO PRODUTO
  // ---------------------------------------------------

  return await carrinhoRepository
    .adicionarItem(

      usuarioId,

      {

        produtoId:
          produto._id,

        nome:
          produto.nome,

        preco:
          produto.preco,

        imagem:
          produto.imagem,

        quantidade

      }

    );

}


// =====================================================
// BUSCAR CARRINHO
// =====================================================

export async function buscarCarrinho(
  usuarioId: string
) {

  if (!usuarioId) {

    throw new AppError(
      'usuarioId é obrigatório.'
    );

  }

  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw new AppError(
      'usuarioId inválido.'
    );

  }


  const usuario =
    await userRepository
      .buscarUsuarioSemPopulate(
        usuarioId
      );


  if (!usuario) {

    throw new AppError(
      'Usuário não encontrado.',
      404
    );

  }


  if (
    usuario.perfil !==
    UserProfile.Cliente
  ) {

    throw new AppError(
      'Apenas clientes possuem carrinho.'
    );

  }


  const carrinho =
    await carrinhoRepository
      .buscarCarrinhoPorUsuario(
        usuarioId
      );


  // ---------------------------------------------------
  // CARRINHO VAZIO / INEXISTENTE
  // ---------------------------------------------------

  if (!carrinho) {

    return {

      usuarioId,

      itens: [],

      quantidadeItens: 0,

      valorTotal: 0

    };

  }


  // ---------------------------------------------------
  // QUANTIDADE TOTAL
  // ---------------------------------------------------

  const quantidadeItens =
    carrinho.itens.reduce(

      (
        total: number,
        item: any
      ) => {

        return total +
          item.quantidade;

      },

      0

    );


  // ---------------------------------------------------
  // VALOR TOTAL
  // ---------------------------------------------------

  const valorTotal =
    carrinho.itens.reduce(

      (
        total: number,
        item: any
      ) => {

        return total +
          item.preco *
          item.quantidade;

      },

      0

    );


  return {

    ...carrinho.toObject(),

    quantidadeItens,

    valorTotal:
      Number(
        valorTotal.toFixed(2)
      )

  };

}


// =====================================================
// ATUALIZAR QUANTIDADE
// =====================================================

export async function atualizarQuantidade(
  usuarioId: string,
  produtoId: string,
  quantidade: number
) {

  if (!usuarioId) {

    throw new AppError(
      'usuarioId é obrigatório.'
    );

  }

  if (!produtoId) {

    throw new AppError(
      'produtoId é obrigatório.'
    );

  }


  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw new AppError(
      'usuarioId inválido.'
    );

  }


  if (
    !Types.ObjectId.isValid(produtoId)
  ) {

    throw new AppError(
      'produtoId inválido.'
    );

  }


  if (
    quantidade === undefined ||
    quantidade === null ||
    !Number.isInteger(quantidade) ||
    quantidade < 1
  ) {

    throw new AppError(
      'A quantidade deve ser um número inteiro maior que zero.'
    );

  }


  // ---------------------------------------------------
  // BUSCAR CARRINHO
  // ---------------------------------------------------

  const carrinho =
    await carrinhoRepository
      .buscarCarrinhoSemPopulate(
        usuarioId
      );


  if (!carrinho) {

    throw new AppError(
      'Carrinho não encontrado.',
      404
    );

  }


  // ---------------------------------------------------
  // VERIFICAR ITEM
  // ---------------------------------------------------

  const itemExiste =
    carrinho.itens.some(

      (item: any) =>
        String(item.produtoId) ===
        String(produtoId)

    );


  if (!itemExiste) {

    throw new AppError(
      'Produto não encontrado no carrinho.',
      404
    );

  }


  // ---------------------------------------------------
  // VERIFICAR PRODUTO ATUAL
  // ---------------------------------------------------

  const produto =
    await produtoRepository
      .buscarProdutoSemPopulate(
        produtoId
      );


  if (!produto) {

    throw new AppError(
      'Produto não encontrado.',
      404
    );

  }


  if (!produto.ativo) {

    throw new AppError(
      'Este produto está inativo.'
    );

  }


  if (
    quantidade >
    produto.estoque
  ) {

    const error =
      new AppError(
        `Estoque insuficiente. Estoque disponível: ${produto.estoque}.`
      );

    error.estoqueDisponivel =
      produto.estoque;

    error.quantidadeSolicitada =
      quantidade;

    throw error;

  }


  // ---------------------------------------------------
  // ATUALIZAR
  // ---------------------------------------------------

  return await carrinhoRepository
    .atualizarItem(

      usuarioId,

      produtoId,

      quantidade

    );

}


// =====================================================
// REMOVER ITEM
// =====================================================

export async function removerItem(
  usuarioId: string,
  produtoId: string
) {

  if (!usuarioId) {

    throw new AppError(
      'usuarioId é obrigatório.'
    );

  }

  if (!produtoId) {

    throw new AppError(
      'produtoId é obrigatório.'
    );

  }


  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw new AppError(
      'usuarioId inválido.'
    );

  }


  if (
    !Types.ObjectId.isValid(produtoId)
  ) {

    throw new AppError(
      'produtoId inválido.'
    );

  }


  const carrinho =
    await carrinhoRepository
      .buscarCarrinhoSemPopulate(
        usuarioId
      );


  if (!carrinho) {

    throw new AppError(
      'Carrinho não encontrado.',
      404
    );

  }


  const itemExiste =
    carrinho.itens.some(

      (item: any) =>
        String(item.produtoId) ===
        String(produtoId)

    );


  if (!itemExiste) {

    throw new AppError(
      'Produto não encontrado no carrinho.',
      404
    );

  }


  return await carrinhoRepository
    .removerItem(

      usuarioId,

      produtoId

    );

}


// =====================================================
// LIMPAR CARRINHO
// =====================================================

export async function limparCarrinho(
  usuarioId: string
) {

  if (!usuarioId) {

    throw new AppError(
      'usuarioId é obrigatório.'
    );

  }


  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw new AppError(
      'usuarioId inválido.'
    );

  }


  const carrinho =
    await carrinhoRepository
      .buscarCarrinhoSemPopulate(
        usuarioId
      );


  if (!carrinho) {

    throw new AppError(
      'Carrinho não encontrado.',
      404
    );

  }


  return await carrinhoRepository
    .limparCarrinho(
      usuarioId
    );

}
