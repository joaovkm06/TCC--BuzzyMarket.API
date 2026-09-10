import * as carrinhoRepository from '../repository/CarrinhoRepository';
import * as userRepository from '../repository/UserRepository';
import * as produtoRepository from '../repository/ProdutoRepository';

function erro(mensagem: string, status = 400) {
  const error: any = new Error(mensagem);
  error.status = status;
  return error;
}

export async function adicionarItem(
  usuarioId: string,
  produtoId: string,
  quantidade: number
) {
  if (!usuarioId) {
    throw erro('usuarioId é obrigatório.');
  }

  if (!produtoId) {
    throw erro('produtoId é obrigatório.');
  }

  if (
    quantidade === undefined ||
    quantidade === null ||
    !Number.isInteger(quantidade) ||
    quantidade < 1
  ) {
    throw erro('A quantidade deve ser um número inteiro maior que zero.');
  }

  // Verifica usuário
  const usuario = await userRepository.buscarUsuarioSemPopulate(usuarioId);

  if (!usuario) {
    throw erro('Usuário não encontrado.', 404);
  }

  // Apenas cliente pode possuir carrinho de compras
  if (usuario.perfil !== 'cliente') {
    throw erro('Apenas clientes podem utilizar o carrinho.');
  }

  // Verifica produto
  const produto = await produtoRepository.buscarProdutoSemPopulate(produtoId);

  if (!produto) {
    throw erro('Produto não encontrado.', 404);
  }

  if (!produto.ativo) {
    throw erro('Este produto está inativo.');
  }

  if (produto.estoque < quantidade) {
    throw erro(
      `Estoque insuficiente. Estoque disponível: ${produto.estoque}.`
    );
  }

  // Verifica se já existe carrinho
  let carrinho =
    await carrinhoRepository.buscarCarrinhoSemPopulate(usuarioId);

  // Se não existe, cria
  if (!carrinho) {
    carrinho = await carrinhoRepository.criarCarrinho({
      usuarioId,
      itens: [
        {
          produtoId: produto._id,
          nome: produto.nome,
          preco: produto.preco,
          imagem: produto.imagem,
          quantidade
        }
      ]
    });

    return await carrinhoRepository.buscarCarrinhoPorUsuario(usuarioId);
  }

  // Verifica se o produto já está no carrinho
  const itemExistente = carrinho.itens.find(
    (item: any) =>
      item.produtoId.toString() === produtoId
  );

  if (itemExistente) {
    const novaQuantidade =
      itemExistente.quantidade + quantidade;

    if (novaQuantidade > produto.estoque) {
      throw erro(
        `Quantidade solicitada ultrapassa o estoque. Estoque disponível: ${produto.estoque}.`
      );
    }

    return await carrinhoRepository.atualizarItem(
      usuarioId,
      produtoId,
      novaQuantidade
    );
  }

  // Adiciona novo produto
  return await carrinhoRepository.adicionarItem(
    usuarioId,
    {
      produtoId: produto._id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade
    }
  );
}

export async function buscarCarrinho(usuarioId: string) {
  if (!usuarioId) {
    throw erro('usuarioId é obrigatório.');
  }

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(usuarioId);

  if (!usuario) {
    throw erro('Usuário não encontrado.', 404);
  }

  if (usuario.perfil !== 'cliente') {
    throw erro('Apenas clientes possuem carrinho.');
  }

  const carrinho =
    await carrinhoRepository.buscarCarrinhoPorUsuario(usuarioId);

  if (!carrinho) {
    return {
      usuarioId,
      itens: [],
      quantidadeItens: 0,
      valorTotal: 0
    };
  }

  const quantidadeItens = carrinho.itens.reduce(
    (total: number, item: any) =>
      total + item.quantidade,
    0
  );

  const valorTotal = carrinho.itens.reduce(
    (total: number, item: any) =>
      total + item.preco * item.quantidade,
    0
  );

  return {
    ...carrinho.toObject(),
    quantidadeItens,
    valorTotal: Number(valorTotal.toFixed(2))
  };
}

export async function atualizarQuantidade(
  usuarioId: string,
  produtoId: string,
  quantidade: number
) {
  if (!usuarioId) {
    throw erro('usuarioId é obrigatório.');
  }

  if (!produtoId) {
    throw erro('produtoId é obrigatório.');
  }

  if (
    quantidade === undefined ||
    quantidade === null ||
    !Number.isInteger(quantidade) ||
    quantidade < 1
  ) {
    throw erro('A quantidade deve ser um número inteiro maior que zero.');
  }

  const carrinho =
    await carrinhoRepository.buscarCarrinhoSemPopulate(usuarioId);

  if (!carrinho) {
    throw erro('Carrinho não encontrado.', 404);
  }

  const itemExiste = carrinho.itens.some(
    (item: any) =>
      item.produtoId.toString() === produtoId
  );

  if (!itemExiste) {
    throw erro('Produto não encontrado no carrinho.', 404);
  }

  const produto =
    await produtoRepository.buscarProdutoSemPopulate(produtoId);

  if (!produto) {
    throw erro('Produto não encontrado.', 404);
  }

  if (!produto.ativo) {
    throw erro('Este produto está inativo.');
  }

  if (quantidade > produto.estoque) {
    throw erro(
      `Estoque insuficiente. Estoque disponível: ${produto.estoque}.`
    );
  }

  return await carrinhoRepository.atualizarItem(
    usuarioId,
    produtoId,
    quantidade
  );
}

export async function removerItem(
  usuarioId: string,
  produtoId: string
) {
  if (!usuarioId) {
    throw erro('usuarioId é obrigatório.');
  }

  if (!produtoId) {
    throw erro('produtoId é obrigatório.');
  }

  const carrinho =
    await carrinhoRepository.buscarCarrinhoSemPopulate(usuarioId);

  if (!carrinho) {
    throw erro('Carrinho não encontrado.', 404);
  }

  const itemExiste = carrinho.itens.some(
    (item: any) =>
      item.produtoId.toString() === produtoId
  );

  if (!itemExiste) {
    throw erro('Produto não encontrado no carrinho.', 404);
  }

  return await carrinhoRepository.removerItem(
    usuarioId,
    produtoId
  );
}

export async function limparCarrinho(usuarioId: string) {
  if (!usuarioId) {
    throw erro('usuarioId é obrigatório.');
  }

  const carrinho =
    await carrinhoRepository.buscarCarrinhoSemPopulate(usuarioId);

  if (!carrinho) {
    throw erro('Carrinho não encontrado.', 404);
  }

  return await carrinhoRepository.limparCarrinho(usuarioId);
}