
import { Types } from 'mongoose';

import * as produtoRepository from '../repository/ProdutoRepository';
import * as lojaRepository from '../repository/LojaRepository';

import { AppError } from '../error/AppError';


// ==========================================
// CRIAR PRODUTO
// ==========================================

export async function criarProduto(
  dados: any
) {
  const {
    lojaId,
    nome,
    descricao,
    categoria,
    preco,
    estoque,
    imagem,
    ativo
  } = dados;


  // ==========================================
  // VALIDAÇÕES
  // ==========================================

  if (
    !lojaId ||
    !nome ||
    !categoria ||
    preco === undefined
  ) {
    throw new AppError(
      'lojaId, nome, categoria e preco são obrigatórios.',
      400
    );
  }


  if (
    typeof nome !== 'string' ||
    !nome.trim()
  ) {
    throw new AppError(
      'O nome do produto não pode ser vazio.',
      400
    );
  }


  if (
    typeof categoria !== 'string' ||
    !categoria.trim()
  ) {
    throw new AppError(
      'A categoria do produto não pode ser vazia.',
      400
    );
  }


  if (
    typeof preco !== 'number' ||
    preco < 0
  ) {
    throw new AppError(
      'O preço deve ser um número maior ou igual a zero.',
      400
    );
  }


  if (
    estoque !== undefined &&
    (
      typeof estoque !== 'number' ||
      estoque < 0
    )
  ) {
    throw new AppError(
      'O estoque deve ser um número maior ou igual a zero.',
      400
    );
  }


  if (
    ativo !== undefined &&
    typeof ativo !== 'boolean'
  ) {
    throw new AppError(
      'O campo ativo deve ser true ou false.',
      400
    );
  }


  // ==========================================
  // VALIDA ID DA LOJA
  // ==========================================

  if (!Types.ObjectId.isValid(lojaId)) {
    throw new AppError(
      'ID da loja inválido.',
      400
    );
  }


  // ==========================================
  // VERIFICA LOJA
  // ==========================================

  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(
      lojaId
    );

  if (!loja) {
    throw new AppError(
      'Loja não encontrada.',
      404
    );
  }


  // ==========================================
  // VERIFICA STATUS DA LOJA
  // ==========================================

  if (loja.status === 'bloqueada') {
    throw new AppError(
      'Não é possível cadastrar produtos em uma loja bloqueada.',
      400
    );
  }


  // ==========================================
  // CRIA PRODUTO
  // ==========================================

  const produto =
    await produtoRepository.criarProduto({
      lojaId: new Types.ObjectId(lojaId),
      nome: nome.trim(),
      descricao,
      categoria: categoria.trim(),
      preco,
      estoque:
        estoque !== undefined
          ? estoque
          : 0,
      imagem,
      ativo:
        ativo !== undefined
          ? ativo
          : true
    });


  // ==========================================
  // RETORNA COM LOJA
  // ==========================================

  return await produtoRepository.buscarProdutoPorId(
    produto._id.toString()
  );
}


// ==========================================
// LISTAR PRODUTOS
// ==========================================

export async function listarProdutos() {
  return await produtoRepository.listarProdutos();
}


// ==========================================
// BUSCAR PRODUTO
// ==========================================

export async function buscarProdutoPorId(
  id: string
) {

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(
      'ID do produto inválido.',
      400
    );
  }


  const produto =
    await produtoRepository.buscarProdutoPorId(id);

  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }


  return produto;
}


// ==========================================
// PRODUTOS DA LOJA
// ==========================================

export async function listarProdutosPorLoja(
  lojaId: string
) {

  if (!Types.ObjectId.isValid(lojaId)) {
    throw new AppError(
      'ID da loja inválido.',
      400
    );
  }


  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(
      lojaId
    );

  if (!loja) {
    throw new AppError(
      'Loja não encontrada.',
      404
    );
  }


  const produtos =
    await produtoRepository.listarProdutosPorLoja(
      lojaId
    );


  return {
    loja: {
      id: loja._id,
      nome: loja.nome,
      categoria: loja.categoria,
      status: loja.status
    },

    produtos
  };
}


// ==========================================
// ATUALIZAR PRODUTO
// ==========================================

export async function atualizarProduto(
  id: string,
  dados: any
) {

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(
      'ID do produto inválido.',
      400
    );
  }


  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );


  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }


  const {
    nome,
    descricao,
    categoria,
    preco,
    estoque,
    imagem,
    ativo
  } = dados;


  // ==========================================
  // NOME
  // ==========================================

  if (nome !== undefined) {

    if (
      typeof nome !== 'string' ||
      !nome.trim()
    ) {
      throw new AppError(
        'O nome do produto não pode ser vazio.',
        400
      );
    }

    produto.nome = nome.trim();
  }


  // ==========================================
  // DESCRIÇÃO
  // ==========================================

  if (descricao !== undefined) {

    if (
      typeof descricao !== 'string'
    ) {
      throw new AppError(
        'A descrição deve ser um texto.',
        400
      );
    }

    produto.descricao = descricao.trim();
  }


  // ==========================================
  // CATEGORIA
  // ==========================================

  if (categoria !== undefined) {

    if (
      typeof categoria !== 'string' ||
      !categoria.trim()
    ) {
      throw new AppError(
        'A categoria do produto não pode ser vazia.',
        400
      );
    }

    produto.categoria = categoria.trim();
  }


  // ==========================================
  // PREÇO
  // ==========================================

  if (preco !== undefined) {

    if (
      typeof preco !== 'number' ||
      preco < 0
    ) {
      throw new AppError(
        'O preço deve ser um número maior ou igual a zero.',
        400
      );
    }

    produto.preco = preco;
  }


  // ==========================================
  // ESTOQUE
  // ==========================================

  if (estoque !== undefined) {

    if (
      typeof estoque !== 'number' ||
      estoque < 0
    ) {
      throw new AppError(
        'O estoque deve ser um número maior ou igual a zero.',
        400
      );
    }

    produto.estoque = estoque;
  }


  // ==========================================
  // IMAGEM
  // ==========================================

  if (imagem !== undefined) {

    if (
      typeof imagem !== 'string'
    ) {
      throw new AppError(
        'A imagem deve ser um texto.',
        400
      );
    }

    produto.imagem = imagem.trim();
  }


  // ==========================================
  // ATIVO
  // ==========================================

  if (ativo !== undefined) {

    if (
      typeof ativo !== 'boolean'
    ) {
      throw new AppError(
        'O campo ativo deve ser true ou false.',
        400
      );
    }

    produto.ativo = ativo;
  }


  await produto.save();


  return await produtoRepository.buscarProdutoPorId(
    produto._id.toString()
  );
}


// ==========================================
// ATUALIZAR ESTOQUE
// ==========================================

export async function atualizarEstoque(
  id: string,
  estoque: any
) {

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(
      'ID do produto inválido.',
      400
    );
  }


  if (estoque === undefined) {
    throw new AppError(
      'Informe o novo estoque.',
      400
    );
  }


  if (
    typeof estoque !== 'number' ||
    estoque < 0
  ) {
    throw new AppError(
      'O estoque deve ser um número maior ou igual a zero.',
      400
    );
  }


  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );


  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }


  produto.estoque = estoque;

  await produto.save();


  return {
    id: produto._id,
    nome: produto.nome,
    estoque: produto.estoque
  };
}


// ==========================================
// ATIVAR / DESATIVAR
// ==========================================

export async function atualizarAtivo(
  id: string,
  ativo: any
) {

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(
      'ID do produto inválido.',
      400
    );
  }


  if (ativo === undefined) {
    throw new AppError(
      'Informe se o produto está ativo ou não.',
      400
    );
  }


  if (typeof ativo !== 'boolean') {
    throw new AppError(
      'O campo ativo deve ser true ou false.',
      400
    );
  }


  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );


  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }


  produto.ativo = ativo;

  await produto.save();


  return {
    id: produto._id,
    nome: produto.nome,
    ativo: produto.ativo
  };
}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

export async function excluirProduto(
  id: string
) {

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(
      'ID do produto inválido.',
      400
    );
  }


  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );


  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }


  await produtoRepository.excluirProduto(id);

  return true;
}

