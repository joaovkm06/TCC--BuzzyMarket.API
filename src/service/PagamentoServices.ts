
import { Types } from 'mongoose';

import * as pagamentoRepository
  from '../repository/PagamentoRepository';

import * as pedidoRepository
  from '../repository/PedidoRepository';

import {
  MetodoPagamento,
  StatusPagamento
} from '../model/pagamento';

import { AppError } from '../error/AppError';


// ======================================================
// CRIAR PAGAMENTO
// ======================================================

export async function criarPagamento(
  dados: any
) {

  const {
    pedidoId,
    valor,
    metodo,
    transacaoId
  } = dados;


  // ====================================================
  // VALIDAÇÃO DOS CAMPOS
  // ====================================================

  if (
    !pedidoId ||
    valor === undefined ||
    !metodo
  ) {

    throw new AppError(
      'pedidoId, valor e metodo são obrigatórios.',
      400
    );
  }


  // ====================================================
  // VALIDA ID DO PEDIDO
  // ====================================================

  if (!Types.ObjectId.isValid(pedidoId)) {

    throw new AppError(
      'pedidoId inválido.',
      400
    );
  }


  // ====================================================
  // MÉTODOS PERMITIDOS
  // ====================================================

  const metodosPermitidos: MetodoPagamento[] = [
    'pix',
    'cartao',
    'boleto'
  ];


  if (
    !metodosPermitidos.includes(
      metodo as MetodoPagamento
    )
  ) {

    const erro = new AppError(
      'Método de pagamento inválido.',
      400
    );

    erro.metodosPermitidos =
      metodosPermitidos;

    throw erro;
  }


  // ====================================================
  // VALIDA VALOR
  // ====================================================

  if (
    typeof valor !== 'number' ||
    valor <= 0
  ) {

    throw new AppError(
      'O valor do pagamento deve ser maior que zero.',
      400
    );
  }


  // ====================================================
  // BUSCA PEDIDO
  // ====================================================

  const pedido =
    await pedidoRepository
      .buscarPedidoSemPopulate(
        pedidoId
      );


  if (!pedido) {

    throw new AppError(
      'Pedido não encontrado.',
      404
    );
  }


  // ====================================================
  // PEDIDO CANCELADO
  // ====================================================

  if (
    pedido.status === 'cancelado'
  ) {

    throw new AppError(
      'Não é possível criar pagamento para um pedido cancelado.',
      400
    );
  }


  // ====================================================
  // VERIFICA PAGAMENTO EXISTENTE
  // ====================================================

  const pagamentoExistente =
    await pagamentoRepository
      .buscarPagamentoPorPedido(
        pedidoId
      );


  if (pagamentoExistente) {

    const erro = new AppError(
      'Este pedido já possui um pagamento.',
      400
    );

    erro.pagamentoId =
      pagamentoExistente._id;

    throw erro;
  }


  // ====================================================
  // CONFERE VALOR DO PEDIDO
  // ====================================================

  if (valor !== pedido.valorTotal) {

    const erro = new AppError(
      'O valor do pagamento deve ser igual ao valor total do pedido.',
      400
    );

    erro.valorPedido =
      pedido.valorTotal;

    erro.valorInformado =
      valor;

    throw erro;
  }


  // ====================================================
  // CRIA PAGAMENTO
  // ====================================================

  return await pagamentoRepository
    .criarPagamento({

      pedidoId:
        new Types.ObjectId(pedidoId),

      // O valor oficial vem do pedido.
      valor:
        pedido.valorTotal,

      metodo:
        metodo as MetodoPagamento,

      status:
        'pendente',

      transacaoId
    });
}


// ======================================================
// LISTAR TODOS
// ======================================================

export async function listarPagamentos() {

  return await pagamentoRepository
    .listarPagamentos();

}


// ======================================================
// BUSCAR PAGAMENTO POR PEDIDO
// ======================================================

export async function buscarPagamentoPorPedido(
  pedidoId: string
) {

  // ====================================================
  // VALIDA ID
  // ====================================================

  if (!Types.ObjectId.isValid(pedidoId)) {

    throw new AppError(
      'pedidoId inválido.',
      400
    );
  }


  // ====================================================
  // VERIFICA PEDIDO
  // ====================================================

  const pedido =
    await pedidoRepository
      .buscarPedidoSemPopulate(
        pedidoId
      );


  if (!pedido) {

    throw new AppError(
      'Pedido não encontrado.',
      404
    );
  }


  // ====================================================
  // BUSCA PAGAMENTO
  // ====================================================

  const pagamento =
    await pagamentoRepository
      .buscarPagamentoPorPedido(
        pedidoId
      );


  if (!pagamento) {

    throw new AppError(
      'Nenhum pagamento encontrado para este pedido.',
      404
    );
  }


  return pagamento;
}


// ======================================================
// BUSCAR PAGAMENTO POR ID
// ======================================================

export async function buscarPagamentoPorId(
  id: string
) {

  if (!Types.ObjectId.isValid(id)) {

    throw new AppError(
      'ID do pagamento inválido.',
      400
    );
  }


  const pagamento =
    await pagamentoRepository
      .buscarPagamentoPorId(
        id
      );


  if (!pagamento) {

    throw new AppError(
      'Pagamento não encontrado.',
      404
    );
  }


  return pagamento;
}


// ======================================================
// ATUALIZAR STATUS
// ======================================================

export async function atualizarStatusPagamento(
  id: string,
  status: string
) {

  // ====================================================
  // STATUS PERMITIDOS
  // ====================================================

  const statusPermitidos: StatusPagamento[] = [
    'pendente',
    'aprovado',
    'recusado',
    'cancelado'
  ];


  if (
    !statusPermitidos.includes(
      status as StatusPagamento
    )
  ) {

    const erro = new AppError(
      'Status de pagamento inválido.',
      400
    );

    erro.statusPermitidos =
      statusPermitidos;

    throw erro;
  }


  // ====================================================
  // VALIDA ID
  // ====================================================

  if (!Types.ObjectId.isValid(id)) {

    throw new AppError(
      'ID do pagamento inválido.',
      400
    );
  }


  // ====================================================
  // BUSCA PAGAMENTO
  // ====================================================

  const pagamento =
    await pagamentoRepository
      .buscarPagamentoSemPopulate(
        id
      );


  if (!pagamento) {

    throw new AppError(
      'Pagamento não encontrado.',
      404
    );
  }


  // ====================================================
  // APROVADO NÃO PODE VOLTAR
  // ====================================================

  if (
    pagamento.status === 'aprovado' &&
    status !== 'aprovado'
  ) {

    throw new AppError(
      'Um pagamento aprovado não pode ter o status alterado.',
      400
    );
  }


  // ====================================================
  // CANCELADO NÃO PODE SER ALTERADO
  // ====================================================

  if (
    pagamento.status === 'cancelado' &&
    status !== 'cancelado'
  ) {

    throw new AppError(
      'Um pagamento cancelado não pode ser alterado.',
      400
    );
  }


  // ====================================================
  // ATUALIZA STATUS
  // ====================================================

  pagamento.status =
    status as StatusPagamento;

  await pagamento.save();


  return await pagamentoRepository
    .buscarPagamentoPorId(
      id
    );
}


// ======================================================
// CANCELAR PAGAMENTO
// ======================================================

export async function cancelarPagamento(
  id: string
) {

  // ====================================================
  // VALIDA ID
  // ====================================================

  if (!Types.ObjectId.isValid(id)) {

    throw new AppError(
      'ID do pagamento inválido.',
      400
    );
  }


  // ====================================================
  // BUSCA PAGAMENTO
  // ====================================================

  const pagamento =
    await pagamentoRepository
      .buscarPagamentoSemPopulate(
        id
      );


  if (!pagamento) {

    throw new AppError(
      'Pagamento não encontrado.',
      404
    );
  }


  // ====================================================
  // NÃO PODE CANCELAR APROVADO
  // ====================================================

  if (
    pagamento.status === 'aprovado'
  ) {

    throw new AppError(
      'Não é possível cancelar um pagamento aprovado.',
      400
    );
  }


  // ====================================================
  // JÁ CANCELADO
  // ====================================================

  if (
    pagamento.status === 'cancelado'
  ) {

    throw new AppError(
      'Este pagamento já está cancelado.',
      400
    );
  }


  // ====================================================
  // CANCELA
  // ====================================================

  pagamento.status =
    'cancelado';

  await pagamento.save();


  return await pagamentoRepository
    .buscarPagamentoPorId(
      id
    );
}

