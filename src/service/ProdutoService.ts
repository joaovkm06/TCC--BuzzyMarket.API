
import { Types } from 'mongoose';

import * as produtoRepository from '../repository/ProdutoRepository';
import * as lojaRepository from '../repository/LojaRepository';


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
    const erro: any = new Error(
      'lojaId, nome, categoria e preco são obrigatórios.'
    );

    erro.status = 400;

    throw erro;
  }


  if (typeof nome !== 'string' || !nome.trim()) {
    const erro: any = new Error(
      'O nome do produto não pode ser vazio.'
    );

    erro.status = 400;

    throw erro;
  }


  if (
    typeof categoria !== 'string' ||
    !categoria.trim()
  ) {
    const erro: any = new Error(
      'A categoria do produto não pode ser vazia.'
    );

    erro.status = 400;

    throw erro;
  }


  if (
    typeof preco !== 'number' ||
    preco < 0
  ) {
    const erro: any = new Error(
      'O preço deve ser um número maior ou igual a zero.'
    );

    erro.status = 400;

    throw erro;
  }


  if (
    estoque !== undefined &&
    (
      typeof estoque !== 'number' ||
      estoque < 0
    )
  ) {
    const erro: any = new Error(
      'O estoque deve ser um número maior ou igual a zero.'
    );

    erro.status = 400;

    throw erro;
  }


  if (
    ativo !== undefined &&
    typeof ativo !== 'boolean'
  ) {
    const erro: any = new Error(
      'O campo ativo deve ser true ou false.'
    );

    erro.status = 400;

    throw erro;
  }


  // ==========================================
  // VALIDA ID DA LOJA
  // ==========================================

  if (!Types.ObjectId.isValid(lojaId)) {
    const erro: any = new Error(
      'ID da loja inválido.'
    );

    erro.status = 400;

    throw erro;
  }


  // ==========================================
  // VERIFICA LOJA
  // ==========================================

  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(
      lojaId
    );

  if (!loja) {
    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }


  // ==========================================
  // VERIFICA STATUS DA LOJA
  // ==========================================

  if (loja.status === 'bloqueada') {
    const erro: any = new Error(
      'Não é possível cadastrar produtos em uma loja bloqueada.'
    );

    erro.status = 400;

    throw erro;
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
    const erro: any = new Error(
      'ID do produto inválido.'
    );

    erro.status = 400;

    throw erro;
  }


  const produto =
    await produtoRepository.buscarProdutoPorId(id);

  if (!produto) {
    const erro: any = new Error(
      'Produto não encontrado.'
    );

    erro.status = 404;

    throw erro;
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
    const erro: any = new Error(
      'ID da loja inválido.'
    );

    erro.status = 400;

    throw erro;
  }


  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(
      lojaId
    );

  if (!loja) {
    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
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
    const erro: any = new Error(
      'ID do produto inválido.'
    );

    erro.status = 400;

    throw erro;
  }


  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );


  if (!produto) {
    const erro: any = new Error(
      'Produto não encontrado.'
    );

    erro.status = 404;

    throw erro;
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
      const erro: any = new Error(
        'O nome do produto não pode ser vazio.'
      );

      erro.status = 400;

      throw erro;
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
      const erro: any = new Error(
        'A descrição deve ser um texto.'
      );

      erro.status = 400;

      throw erro;
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
      const erro: any = new Error(
        'A categoria do produto não pode ser vazia.'
      );

      erro.status = 400;

      throw erro;
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
      const erro: any = new Error(
        'O preço deve ser um número maior ou igual a zero.'
      );

      erro.status = 400;

      throw erro;
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
      const erro: any = new Error(
        'O estoque deve ser um número maior ou igual a zero.'
      );

      erro.status = 400;

      throw erro;
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
      const erro: any = new Error(
        'A imagem deve ser um texto.'
      );

      erro.status = 400;

      throw erro;
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
      const erro: any = new Error(
        'O campo ativo deve ser true ou false.'
      );

      erro.status = 400;

      throw erro;
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
    const erro: any = new Error(
      'ID do produto inválido.'
    );

    erro.status = 400;

    throw erro;
  }


  if (estoque === undefined) {
    const erro: any = new Error(
      'Informe o novo estoque.'
    );

    erro.status = 400;

    throw erro;
  }


  if (
    typeof estoque !== 'number' ||
    estoque < 0
  ) {
    const erro: any = new Error(
      'O estoque deve ser um número maior ou igual a zero.'
    );

    erro.status = 400;

    throw erro;
  }


  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );


  if (!produto) {
    const erro: any = new Error(
      'Produto não encontrado.'
    );

    erro.status = 404;

    throw erro;
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
    const erro: any = new Error(
      'ID do produto inválido.'
    );

    erro.status = 400;

    throw erro;
  }


  if (ativo === undefined) {
    const erro: any = new Error(
      'Informe se o produto está ativo ou não.'
    );

    erro.status = 400;

    throw erro;
  }


  if (typeof ativo !== 'boolean') {
    const erro: any = new Error(
      'O campo ativo deve ser true ou false.'
    );

    erro.status = 400;

    throw erro;
  }


  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );


  if (!produto) {
    const erro: any = new Error(
      'Produto não encontrado.'
    );

    erro.status = 404;

    throw erro;
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
    const erro: any = new Error(
      'ID do produto inválido.'
    );

    erro.status = 400;

    throw erro;
  }


  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );


  if (!produto) {
    const erro: any = new Error(
      'Produto não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


  await produtoRepository.excluirProduto(id);

  return true;
}

