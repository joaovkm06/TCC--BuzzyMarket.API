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


  // ==============================
  // VALIDAÇÕES
  // ==============================

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


  // ==============================
  // VERIFICA LOJA
  // ==============================

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


  // ==============================
  // LOJA BLOQUEADA
  // ==============================

  if (loja.status === 'bloqueada') {

    const erro: any = new Error(
      'Não é possível cadastrar produtos em uma loja bloqueada.'
    );

    erro.status = 400;

    throw erro;
  }


  // ==============================
  // CRIA PRODUTO
  // ==============================

  const produto =
    await produtoRepository.criarProduto({

      lojaId,

      nome,

      descricao,

      categoria,

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


  // ==============================
  // BUSCA COM LOJA
  // ==============================

  const produtoCriado =
    await produtoRepository.buscarProdutoPorId(
      produto._id.toString()
    );


  return produtoCriado;
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

  // Verifica loja

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
    lojaId,
    nome,
    descricao,
    categoria,
    preco,
    estoque,
    imagem,
    ativo
  } = dados;


  // ==============================
  // ALTERAR LOJA
  // ==============================

  if (lojaId !== undefined) {

    const loja =
      await lojaRepository.buscarLojaPorIdSemPopulate(
        lojaId
      );


    if (!loja) {

      const erro: any = new Error(
        'Nova loja não encontrada.'
      );

      erro.status = 404;

      throw erro;
    }


    if (loja.status === 'bloqueada') {

      const erro: any = new Error(
        'Não é possível vincular o produto a uma loja bloqueada.'
      );

      erro.status = 400;

      throw erro;
    }


    produto.lojaId = lojaId;
  }


  // ==============================
  // CAMPOS
  // ==============================

  if (nome !== undefined) {
    produto.nome = nome;
  }

  if (descricao !== undefined) {
    produto.descricao = descricao;
  }

  if (categoria !== undefined) {
    produto.categoria = categoria;
  }

  if (preco !== undefined) {
    produto.preco = preco;
  }

  if (estoque !== undefined) {
    produto.estoque = estoque;
  }

  if (imagem !== undefined) {
    produto.imagem = imagem;
  }

  if (ativo !== undefined) {
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