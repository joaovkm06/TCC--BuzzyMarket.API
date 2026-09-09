import * as pedidoRepository from '../repository/PedidoRepository';
import * as userRepository from '../repository/UserRepository';
import * as lojaRepository from '../repository/LojaRepository';
import * as produtoRepository from '../repository/ProdutoRepository';

export async function criarPedido(dados: any) {
  const {
    usuarioId,
    lojaId,
    itens,
    enderecoEntrega
  } = dados;

  // ==================================================
  // VALIDAÇÕES
  // ==================================================

  if (
    !usuarioId ||
    !lojaId ||
    !itens ||
    !Array.isArray(itens) ||
    itens.length === 0 ||
    !enderecoEntrega
  ) {
    const erro: any = new Error(
      'usuarioId, lojaId, itens e enderecoEntrega são obrigatórios.'
    );

    erro.status = 400;

    throw erro;
  }

  // ==================================================
  // VERIFICA USUÁRIO
  // ==================================================

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId.toString()
    );

  if (!usuario) {
    const erro: any = new Error(
      'Usuário não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }

  if (usuario.perfil !== 'cliente') {
    const erro: any = new Error(
      'Somente usuários com perfil cliente podem realizar pedidos.'
    );

    erro.status = 400;

    throw erro;
  }

  // ==================================================
  // VERIFICA LOJA
  // ==================================================

  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(
      lojaId.toString()
    );

  if (!loja) {
    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }

  if (loja.status !== 'aprovada') {
    const erro: any = new Error(
      'Não é possível realizar pedidos em uma loja que não está aprovada.'
    );

    erro.status = 400;

    throw erro;
  }

  // ==================================================
  // VERIFICA ENDEREÇO
  // ==================================================

  if (
    !enderecoEntrega.cep ||
    !enderecoEntrega.logradouro ||
    !enderecoEntrega.numero ||
    !enderecoEntrega.bairro ||
    !enderecoEntrega.cidade ||
    !enderecoEntrega.estado
  ) {
    const erro: any = new Error(
      'CEP, logradouro, número, bairro, cidade e estado são obrigatórios no endereço de entrega.'
    );

    erro.status = 400;

    throw erro;
  }

  // ==================================================
  // PROCESSA PRODUTOS
  // ==================================================

  const itensPedido: any[] = [];

  let valorTotal = 0;

  for (const item of itens) {

    if (!item.produtoId) {
      const erro: any = new Error(
        'Todos os itens precisam possuir produtoId.'
      );

      erro.status = 400;

      throw erro;
    }

    if (
      !item.quantidade ||
      typeof item.quantidade !== 'number' ||
      item.quantidade < 1
    ) {
      const erro: any = new Error(
        'A quantidade de cada produto deve ser maior que zero.'
      );

      erro.status = 400;

      throw erro;
    }

    // ==================================================
    // BUSCA PRODUTO
    // ==================================================

    const produto =
      await produtoRepository.buscarProdutoSemPopulate(
        item.produtoId.toString()
      );

    if (!produto) {
      const erro: any = new Error(
        `Produto ${item.produtoId} não encontrado.`
      );

      erro.status = 404;

      throw erro;
    }

    // ==================================================
    // VERIFICA LOJA DO PRODUTO
    // ==================================================

    if (
      produto.lojaId.toString() !==
      lojaId.toString()
    ) {
      const erro: any = new Error(
        `O produto "${produto.nome}" não pertence a esta loja.`
      );

      erro.status = 400;

      throw erro;
    }

    // ==================================================
    // PRODUTO ATIVO
    // ==================================================

    if (!produto.ativo) {
      const erro: any = new Error(
        `O produto "${produto.nome}" está indisponível.`
      );

      erro.status = 400;

      throw erro;
    }

    // ==================================================
    // ESTOQUE
    // ==================================================

    if (produto.estoque < item.quantidade) {
      const erro: any = new Error(
        `Estoque insuficiente para o produto "${produto.nome}".`
      );

      erro.status = 400;
      erro.estoqueDisponivel = produto.estoque;
      erro.quantidadeSolicitada = item.quantidade;

      throw erro;
    }

    // ==================================================
    // SUBTOTAL
    // ==================================================

    const subtotal =
      produto.preco * item.quantidade;

    valorTotal += subtotal;

    // ==================================================
    // ITEM DO PEDIDO
    // ==================================================

    itensPedido.push({
      produtoId: produto._id,
      nome: produto.nome,
      quantidade: item.quantidade,
      preco: produto.preco,
      subtotal
    });
  }

  // ==================================================
  // CRIA PEDIDO
  // ==================================================

  const pedido =
    await pedidoRepository.criarPedido({
      usuarioId,
      lojaId,
      itens: itensPedido,
      valorTotal,
      enderecoEntrega,
      status: 'pendente'
    });

  // ==================================================
  // DIMINUI ESTOQUE
  // ==================================================

  for (const item of itensPedido) {

    await produtoRepository.atualizarProduto(
      item.produtoId.toString(),
      {
        $inc: {
          estoque: -item.quantidade
        }
      }
    );
  }

  // ==================================================
  // BUSCA PEDIDO COMPLETO
  // ==================================================

  return await pedidoRepository.buscarPedidoPorId(
    pedido._id.toString()
  );
}


// ======================================================
// LISTAR TODOS
// ======================================================

export async function listarPedidos() {
  return await pedidoRepository.listarPedidos();
}


// ======================================================
// BUSCAR POR ID
// ======================================================

export async function buscarPedidoPorId(
  id: string
) {
  const pedido =
    await pedidoRepository.buscarPedidoPorId(id);

  if (!pedido) {
    const erro: any = new Error(
      'Pedido não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }

  return pedido;
}


// ======================================================
// LISTAR POR USUÁRIO
// ======================================================

export async function listarPedidosPorUsuario(
  usuarioId: string
) {

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId
    );

  if (!usuario) {
    const erro: any = new Error(
      'Usuário não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }

  const pedidos =
    await pedidoRepository.listarPedidosPorUsuario(
      usuarioId
    );

  return {
    usuario: {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email
    },
    pedidos
  };
}


// ======================================================
// LISTAR POR LOJA
// ======================================================

export async function listarPedidosPorLoja(
  lojaId: string
) {

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

  const pedidos =
    await pedidoRepository.listarPedidosPorLoja(
      lojaId
    );

  return {
    loja: {
      id: loja._id,
      nome: loja.nome,
      categoria: loja.categoria
    },
    pedidos
  };
}


// ======================================================
// ATUALIZAR STATUS
// ======================================================

export async function atualizarStatusPedido(
  id: string,
  status: string
) {

  const statusPermitidos = [
    'pendente',
    'confirmado',
    'preparando',
    'enviado',
    'entregue',
    'cancelado'
  ];

  if (!statusPermitidos.includes(status)) {
    const erro: any = new Error(
      'Status de pedido inválido.'
    );

    erro.status = 400;
    erro.statusPermitidos = statusPermitidos;

    throw erro;
  }

  const pedido =
    await pedidoRepository.buscarPedidoSemPopulate(
      id
    );

  if (!pedido) {
    const erro: any = new Error(
      'Pedido não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }

  if (pedido.status === 'entregue') {
    const erro: any = new Error(
      'Não é possível alterar um pedido que já foi entregue.'
    );

    erro.status = 400;

    throw erro;
  }

  if (pedido.status === 'cancelado') {
    const erro: any = new Error(
      'Não é possível alterar um pedido cancelado.'
    );

    erro.status = 400;

    throw erro;
  }

  pedido.status = status as any;

  await pedido.save();

  return await pedidoRepository.buscarPedidoPorId(id);
}


// ======================================================
// CANCELAR PEDIDO
// ======================================================

export async function cancelarPedido(
  id: string
) {

  const pedido =
    await pedidoRepository.buscarPedidoSemPopulate(
      id
    );

  if (!pedido) {
    const erro: any = new Error(
      'Pedido não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }

  // ==================================================
  // NÃO PODE CANCELAR ENVIADO OU ENTREGUE
  // ==================================================

  if (
    pedido.status === 'enviado' ||
    pedido.status === 'entregue'
  ) {
    const erro: any = new Error(
      'Não é possível cancelar um pedido que já foi enviado ou entregue.'
    );

    erro.status = 400;

    throw erro;
  }

  if (pedido.status === 'cancelado') {
    const erro: any = new Error(
      'Este pedido já está cancelado.'
    );

    erro.status = 400;

    throw erro;
  }

  // ==================================================
  // DEVOLVE ESTOQUE
  // ==================================================

  for (const item of pedido.itens) {

    await produtoRepository.atualizarProduto(
      item.produtoId.toString(),
      {
        $inc: {
          estoque: item.quantidade
        }
      }
    );
  }

  // ==================================================
  // CANCELA
  // ==================================================

  pedido.status = 'cancelado';

  await pedido.save();

  return await pedidoRepository.buscarPedidoPorId(id);
}