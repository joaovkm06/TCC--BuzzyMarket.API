
import * as pedidoRepository from '../repository/PedidoRepository';
import * as userRepository from '../repository/UserRepository';
import * as lojaRepository from '../repository/LojaRepository';
import * as produtoRepository from '../repository/ProdutoRepository';


// ======================================================
// FUNÇÃO AUXILIAR PARA CRIAR ERROS
// ======================================================

function criarErro(mensagem: string, status: number) {
  const erro: any = new Error(mensagem);
  erro.status = status;

  return erro;
}


// ======================================================
// CRIAR PEDIDO
// ======================================================

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

    throw criarErro(
      'usuarioId, lojaId, itens e enderecoEntrega são obrigatórios.',
      400
    );
  }


  // ==================================================
  // VERIFICA USUÁRIO
  // ==================================================

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId.toString()
    );


  if (!usuario) {

    throw criarErro(
      'Usuário não encontrado.',
      404
    );
  }


  if (usuario.perfil !== 'cliente') {

    throw criarErro(
      'Somente usuários com perfil cliente podem realizar pedidos.',
      400
    );
  }


  // ==================================================
  // VERIFICA LOJA
  // ==================================================

  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(
      lojaId.toString()
    );


  if (!loja) {

    throw criarErro(
      'Loja não encontrada.',
      404
    );
  }


  if (loja.status !== 'aprovada') {

    throw criarErro(
      'Não é possível realizar pedidos em uma loja que não está aprovada.',
      400
    );
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

    throw criarErro(
      'CEP, logradouro, número, bairro, cidade e estado são obrigatórios no endereço de entrega.',
      400
    );
  }


  // ==================================================
  // PROCESSA PRODUTOS
  // ==================================================

  const itensPedido: any[] = [];

  let valorTotal = 0;


  for (const item of itens) {

    // ==================================================
    // VERIFICA PRODUTO ID
    // ==================================================

    if (!item.produtoId) {

      throw criarErro(
        'Todos os itens precisam possuir produtoId.',
        400
      );
    }


    // ==================================================
    // VERIFICA QUANTIDADE
    // ==================================================

    if (
      typeof item.quantidade !== 'number' ||
      !Number.isInteger(item.quantidade) ||
      item.quantidade < 1
    ) {

      throw criarErro(
        'A quantidade de cada produto deve ser um número inteiro maior que zero.',
        400
      );
    }


    // ==================================================
    // BUSCA PRODUTO
    // ==================================================

    const produto =
      await produtoRepository.buscarProdutoSemPopulate(
        item.produtoId.toString()
      );


    if (!produto) {

      throw criarErro(
        `Produto ${item.produtoId} não encontrado.`,
        404
      );
    }


    // ==================================================
    // VERIFICA LOJA DO PRODUTO
    // ==================================================

    if (
      produto.lojaId.toString() !==
      lojaId.toString()
    ) {

      throw criarErro(
        `O produto "${produto.nome}" não pertence a esta loja.`,
        400
      );
    }


    // ==================================================
    // VERIFICA SE PRODUTO ESTÁ ATIVO
    // ==================================================

    if (!produto.ativo) {

      throw criarErro(
        `O produto "${produto.nome}" está indisponível.`,
        400
      );
    }


    // ==================================================
    // VERIFICA ESTOQUE
    // ==================================================

    if (produto.estoque < item.quantidade) {

      const erro: any = criarErro(
        `Estoque insuficiente para o produto "${produto.nome}".`,
        400
      );

      erro.estoqueDisponivel =
        produto.estoque;

      erro.quantidadeSolicitada =
        item.quantidade;

      throw erro;
    }


    // ==================================================
    // CALCULA SUBTOTAL
    // ==================================================

    const subtotal =
      produto.preco * item.quantidade;


    valorTotal += subtotal;


    // ==================================================
    // ADICIONA ITEM AO PEDIDO
    // ==================================================

    itensPedido.push({

      produtoId: produto._id,

      nome: produto.nome,

      quantidade: item.quantidade,

      preco: produto.preco,

      subtotal

    });
  }


  // ======================================================
  // CRIA PEDIDO
  // ======================================================

  const pedido =
    await pedidoRepository.criarPedido({

      usuarioId,

      lojaId,

      itens: itensPedido,

      valorTotal,

      enderecoEntrega,

      status: 'pendente'

    });


  // ======================================================
  // DIMINUI ESTOQUE
  // ======================================================

  for (const item of itensPedido) {

    await produtoRepository.alterarEstoque(

      item.produtoId.toString(),

      -item.quantidade

    );
  }


  // ======================================================
  // BUSCA PEDIDO COMPLETO
  // ======================================================

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
    await pedidoRepository.buscarPedidoPorId(
      id
    );


  if (!pedido) {

    throw criarErro(
      'Pedido não encontrado.',
      404
    );
  }


  return pedido;
}


// ======================================================
// LISTAR POR USUÁRIO
// ======================================================

export async function listarPedidosPorUsuario(
  usuarioId: string
) {

  // ==================================================
  // VERIFICA USUÁRIO
  // ==================================================

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId
    );


  if (!usuario) {

    throw criarErro(
      'Usuário não encontrado.',
      404
    );
  }


  // ==================================================
  // BUSCA PEDIDOS
  // ==================================================

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

  // ==================================================
  // VERIFICA LOJA
  // ==================================================

  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(
      lojaId
    );


  if (!loja) {

    throw criarErro(
      'Loja não encontrada.',
      404
    );
  }


  // ==================================================
  // BUSCA PEDIDOS
  // ==================================================

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

  // ==================================================
  // STATUS PERMITIDOS
  // ==================================================

  const statusPermitidos = [

    'pendente',

    'confirmado',

    'preparando',

    'enviado',

    'entregue',

    'cancelado'

  ];


  // ==================================================
  // VERIFICA STATUS
  // ==================================================

  if (!statusPermitidos.includes(status)) {

    const erro: any = criarErro(
      'Status de pedido inválido.',
      400
    );

    erro.statusPermitidos =
      statusPermitidos;

    throw erro;
  }


  // ==================================================
  // BUSCA PEDIDO
  // ==================================================

  const pedido =
    await pedidoRepository.buscarPedidoSemPopulate(
      id
    );


  if (!pedido) {

    throw criarErro(
      'Pedido não encontrado.',
      404
    );
  }


  // ==================================================
  // PEDIDO ENTREGUE
  // ==================================================

  if (pedido.status === 'entregue') {

    throw criarErro(
      'Não é possível alterar um pedido que já foi entregue.',
      400
    );
  }


  // ==================================================
  // PEDIDO CANCELADO
  // ==================================================

  if (pedido.status === 'cancelado') {

    throw criarErro(
      'Não é possível alterar um pedido cancelado.',
      400
    );
  }


  // ==================================================
  // ATUALIZA STATUS
  // ==================================================

  pedido.status = status as any;

  await pedido.save();


  // ==================================================
  // RETORNA PEDIDO
  // ==================================================

  return await pedidoRepository.buscarPedidoPorId(
    id
  );
}


// ======================================================
// CANCELAR PEDIDO
// ======================================================

export async function cancelarPedido(
  id: string
) {

  // ==================================================
  // BUSCA PEDIDO
  // ==================================================

  const pedido =
    await pedidoRepository.buscarPedidoSemPopulate(
      id
    );


  if (!pedido) {

    throw criarErro(
      'Pedido não encontrado.',
      404
    );
  }


  // ==================================================
  // NÃO PODE CANCELAR ENVIADO OU ENTREGUE
  // ==================================================

  if (
    pedido.status === 'enviado' ||
    pedido.status === 'entregue'
  ) {

    throw criarErro(
      'Não é possível cancelar um pedido que já foi enviado ou entregue.',
      400
    );
  }


  // ==================================================
  // JÁ ESTÁ CANCELADO
  // ==================================================

  if (pedido.status === 'cancelado') {

    throw criarErro(
      'Este pedido já está cancelado.',
      400
    );
  }


  // ==================================================
  // DEVOLVE ESTOQUE
  // ==================================================

  for (const item of pedido.itens) {

    await produtoRepository.alterarEstoque(

      item.produtoId.toString(),

      item.quantidade

    );
  }


  // ==================================================
  // CANCELA PEDIDO
  // ==================================================

  pedido.status = 'cancelado';

  await pedido.save();


  // ==================================================
  // RETORNA PEDIDO COMPLETO
  // ==================================================

  return await pedidoRepository.buscarPedidoPorId(
    id
  );
}

