import * as pagamentoRepository
  from '../repository/PagamentoRepositoy';

import * as pedidoRepository
  from '../repository/PedidoRepository';


// =====================================================
// CRIAR PAGAMENTO
// =====================================================

export async function criarPagamento(
  dados: any
) {

  const {
    pedidoId,
    valor,
    metodo,
    transacaoId
  } = dados;


  // ===================================================
  // VALIDAÇÃO
  // ===================================================

  if (
    !pedidoId ||
    valor === undefined ||
    !metodo
  ) {

    const erro: any = new Error(
      'pedidoId, valor e metodo são obrigatórios.'
    );

    erro.status = 400;

    throw erro;
  }


  // ===================================================
  // MÉTODOS PERMITIDOS
  // ===================================================

  const metodosPermitidos = [
    'pix',
    'cartao',
    'boleto'
  ];


  if (!metodosPermitidos.includes(metodo)) {

    const erro: any = new Error(
      'Método de pagamento inválido.'
    );

    erro.status = 400;
    erro.metodosPermitidos = metodosPermitidos;

    throw erro;
  }


  // ===================================================
  // VALIDA VALOR
  // ===================================================

  if (
    typeof valor !== 'number' ||
    valor <= 0
  ) {

    const erro: any = new Error(
      'O valor do pagamento deve ser maior que zero.'
    );

    erro.status = 400;

    throw erro;
  }


  // ===================================================
  // VERIFICA PEDIDO
  // ===================================================

  const pedido =
    await pedidoRepository
      .buscarPedidoSemPopulate(
        pedidoId.toString()
      );


  if (!pedido) {

    const erro: any = new Error(
      'Pedido não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


  // ===================================================
  // VERIFICA PAGAMENTO EXISTENTE
  // ===================================================

  const pagamentoExistente =
    await pagamentoRepository
      .buscarPagamentoPorPedido(
        pedidoId.toString()
      );


  if (pagamentoExistente) {

    const erro: any = new Error(
      'Este pedido já possui um pagamento.'
    );

    erro.status = 400;
    erro.pagamentoId =
      pagamentoExistente._id;

    throw erro;
  }


  // ===================================================
  // CONFERE VALOR DO PEDIDO
  // ===================================================

  if (valor !== pedido.valorTotal) {

    const erro: any = new Error(
      'O valor do pagamento deve ser igual ao valor total do pedido.'
    );

    erro.status = 400;

    erro.valorPedido =
      pedido.valorTotal;

    erro.valorInformado =
      valor;

    throw erro;
  }


  // ===================================================
  // CRIA PAGAMENTO
  // ===================================================

  return await pagamentoRepository
    .criarPagamento({

      pedidoId,

      valor: pedido.valorTotal,

      metodo,

      status: 'pendente',

      transacaoId

    });
}


// =====================================================
// LISTAR TODOS
// =====================================================

export async function listarPagamentos() {

  return await pagamentoRepository
    .listarPagamentos();
}


// =====================================================
// BUSCAR POR PEDIDO
// =====================================================

export async function buscarPagamentoPorPedido(
  pedidoId: string
) {

  // ===================================================
  // VERIFICA PEDIDO
  // ===================================================

  const pedido =
    await pedidoRepository
      .buscarPedidoSemPopulate(
        pedidoId
      );


  if (!pedido) {

    const erro: any = new Error(
      'Pedido não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


  // ===================================================
  // BUSCA PAGAMENTO
  // ===================================================

  const pagamento =
    await pagamentoRepository
      .buscarPagamentoPorPedido(
        pedidoId
      );


  if (!pagamento) {

    const erro: any = new Error(
      'Nenhum pagamento encontrado para este pedido.'
    );

    erro.status = 404;

    throw erro;
  }


  return pagamento;
}


// =====================================================
// BUSCAR POR ID
// =====================================================

export async function buscarPagamentoPorId(
  id: string
) {

  const pagamento =
    await pagamentoRepository
      .buscarPagamentoPorId(id);


  if (!pagamento) {

    const erro: any = new Error(
      'Pagamento não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


  return pagamento;
}


// =====================================================
// ATUALIZAR STATUS
// =====================================================

export async function atualizarStatusPagamento(
  id: string,
  status: string
) {

  // ===================================================
  // STATUS PERMITIDOS
  // ===================================================

  const statusPermitidos = [
    'pendente',
    'aprovado',
    'recusado',
    'cancelado'
  ];


  if (!statusPermitidos.includes(status)) {

    const erro: any = new Error(
      'Status de pagamento inválido.'
    );

    erro.status = 400;
    erro.statusPermitidos =
      statusPermitidos;

    throw erro;
  }


  // ===================================================
  // BUSCA PAGAMENTO
  // ===================================================

  const pagamento =
    await pagamentoRepository
      .buscarPagamentoSemPopulate(id);


  if (!pagamento) {

    const erro: any = new Error(
      'Pagamento não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


  // ===================================================
  // APROVADO NÃO PODE VOLTAR
  // ===================================================

  if (
    pagamento.status === 'aprovado' &&
    status !== 'aprovado'
  ) {

    const erro: any = new Error(
      'Um pagamento aprovado não pode ter o status alterado.'
    );

    erro.status = 400;

    throw erro;
  }


  // ===================================================
  // CANCELADO NÃO PODE SER ALTERADO
  // ===================================================

  if (
    pagamento.status === 'cancelado' &&
    status !== 'cancelado'
  ) {

    const erro: any = new Error(
      'Um pagamento cancelado não pode ser alterado.'
    );

    erro.status = 400;

    throw erro;
  }


  // ===================================================
  // ATUALIZA
  // ===================================================

  pagamento.status =
    status as any;

  await pagamento.save();


  return await pagamentoRepository
    .buscarPagamentoPorId(id);
}


// =====================================================
// CANCELAR PAGAMENTO
// =====================================================

export async function cancelarPagamento(
  id: string
) {

  const pagamento =
    await pagamentoRepository
      .buscarPagamentoSemPopulate(id);


  if (!pagamento) {

    const erro: any = new Error(
      'Pagamento não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


  // ===================================================
  // NÃO PODE CANCELAR APROVADO
  // ===================================================

  if (
    pagamento.status === 'aprovado'
  ) {

    const erro: any = new Error(
      'Não é possível cancelar um pagamento aprovado.'
    );

    erro.status = 400;

    throw erro;
  }


  // ===================================================
  // JÁ CANCELADO
  // ===================================================

  if (
    pagamento.status === 'cancelado'
  ) {

    const erro: any = new Error(
      'Este pagamento já está cancelado.'
    );

    erro.status = 400;

    throw erro;
  }


  // ===================================================
  // CANCELA
  // ===================================================

  pagamento.status =
    'cancelado';

  await pagamento.save();


  return await pagamentoRepository
    .buscarPagamentoPorId(id);
}