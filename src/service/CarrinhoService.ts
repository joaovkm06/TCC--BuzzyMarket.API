
import { Types } from 'mongoose';

import * as carrinhoRepository
  from '../repository/CarrinhoRepository';

import * as userRepository
  from '../repository/UserRepository';

import * as produtoRepository
  from '../repository/ProdutoRepository';

import { UserProfile } from '../model/usuario';


// =====================================================
// ERRO PADRONIZADO
// =====================================================

function erro(
  mensagem: string,
  status = 400
) {

  const error: any =
    new Error(mensagem);

  error.status = status;

  return error;
}


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
    throw erro(
      'usuarioId é obrigatório.'
    );
  }

  if (!produtoId) {
    throw erro(
      'produtoId é obrigatório.'
    );
  }

  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw erro(
      'usuarioId inválido.'
    );

  }

  if (
    !Types.ObjectId.isValid(produtoId)
  ) {

    throw erro(
      'produtoId inválido.'
    );

  }

  if (
    quantidade === undefined ||
    quantidade === null ||
    !Number.isInteger(quantidade) ||
    quantidade < 1
  ) {

    throw erro(
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

    throw erro(
      'Usuário não encontrado.',
      404
    );

  }


  if (
    usuario.perfil !==
    UserProfile.Cliente
  ) {

    throw erro(
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

    throw erro(
      'Produto não encontrado.',
      404
    );

  }


  if (!produto.ativo) {

    throw erro(
      'Este produto está inativo.'
    );

  }


  if (
    produto.estoque < quantidade
  ) {

    throw erro(
      `Estoque insuficiente. Estoque disponível: ${produto.estoque}.`
    );

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

      throw erro(
        `Quantidade solicitada ultrapassa o estoque. Estoque disponível: ${produto.estoque}.`
      );

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

    throw erro(
      'usuarioId é obrigatório.'
    );

  }


  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw erro(
      'usuarioId inválido.'
    );

  }


  const usuario =
    await userRepository
      .buscarUsuarioSemPopulate(
        usuarioId
      );


  if (!usuario) {

    throw erro(
      'Usuário não encontrado.',
      404
    );

  }


  if (
    usuario.perfil !==
    UserProfile.Cliente
  ) {

    throw erro(
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

    throw erro(
      'usuarioId é obrigatório.'
    );

  }

  if (!produtoId) {

    throw erro(
      'produtoId é obrigatório.'
    );

  }


  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw erro(
      'usuarioId inválido.'
    );

  }


  if (
    !Types.ObjectId.isValid(produtoId)
  ) {

    throw erro(
      'produtoId inválido.'
    );

  }


  if (
    quantidade === undefined ||
    quantidade === null ||
    !Number.isInteger(quantidade) ||
    quantidade < 1
  ) {

    throw erro(
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

    throw erro(
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

    throw erro(
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

    throw erro(
      'Produto não encontrado.',
      404
    );

  }


  if (!produto.ativo) {

    throw erro(
      'Este produto está inativo.'
    );

  }


  if (
    quantidade >
    produto.estoque
  ) {

    throw erro(
      `Estoque insuficiente. Estoque disponível: ${produto.estoque}.`
    );

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

    throw erro(
      'usuarioId é obrigatório.'
    );

  }

  if (!produtoId) {

    throw erro(
      'produtoId é obrigatório.'
    );

  }


  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw erro(
      'usuarioId inválido.'
    );

  }


  if (
    !Types.ObjectId.isValid(produtoId)
  ) {

    throw erro(
      'produtoId inválido.'
    );

  }


  const carrinho =
    await carrinhoRepository
      .buscarCarrinhoSemPopulate(
        usuarioId
      );


  if (!carrinho) {

    throw erro(
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

    throw erro(
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

    throw erro(
      'usuarioId é obrigatório.'
    );

  }


  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw erro(
      'usuarioId inválido.'
    );

  }


  const carrinho =
    await carrinhoRepository
      .buscarCarrinhoSemPopulate(
        usuarioId
      );


  if (!carrinho) {

    throw erro(
      'Carrinho não encontrado.',
      404
    );

  }


  return await carrinhoRepository
    .limparCarrinho(
      usuarioId
    );

}

