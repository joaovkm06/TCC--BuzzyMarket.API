import { Request, Response } from 'express';
import * as pedidoService from '../service/PedidoService';

export async function criarPedido(
  req: Request,
  res: Response
) {
  try {

    const pedido =
      await pedidoService.criarPedido(
        req.body
      );

    return res.status(201).json({
      mensagem: 'Pedido criado com sucesso.',
      pedido
    });

  } catch (error: any) {

    console.error(
      'Erro ao criar pedido:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      mensagem:
        error.message ||
        'Não foi possível criar o pedido.',
      ...(error.estoqueDisponivel !== undefined && {
        estoqueDisponivel:
          error.estoqueDisponivel
      }),
      ...(error.quantidadeSolicitada !== undefined && {
        quantidadeSolicitada:
          error.quantidadeSolicitada
      })
    });
  }
}


// ======================================================
// LISTAR TODOS
// ======================================================

export async function listarPedidos(
  req: Request,
  res: Response
) {
  try {

    const pedidos =
      await pedidoService.listarPedidos();

    return res.status(200).json(
      pedidos
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar pedidos:',
      error
    );

    return res.status(500).json({
      mensagem:
        'Não foi possível buscar os pedidos.',
      erro: error.message
    });
  }
}


// ======================================================
// BUSCAR POR ID
// ======================================================

export async function buscarPedidoPorId(
  req: Request,
  res: Response
) {
  try {

    const pedido =
      await pedidoService.buscarPedidoPorId(
        String(req.params.id)
      );

    return res.status(200).json(
      pedido
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar pedido:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      mensagem:
        error.message ||
        'Não foi possível buscar o pedido.'
    });
  }
}


// ======================================================
// LISTAR POR USUÁRIO
// ======================================================

export async function listarPedidosPorUsuario(
  req: Request,
  res: Response
) {
  try {

    const resultado =
      await pedidoService.listarPedidosPorUsuario(
        String(req.params.usuarioId)
      );

    return res.status(200).json(
      resultado
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar pedidos do usuário:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      mensagem:
        error.message ||
        'Não foi possível buscar os pedidos do usuário.'
    });
  }
}


// ======================================================
// LISTAR POR LOJA
// ======================================================

export async function listarPedidosPorLoja(
  req: Request,
  res: Response
) {
  try {

    const resultado =
      await pedidoService.listarPedidosPorLoja(
        String(req.params.lojaId)
      );

    return res.status(200).json(
      resultado
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar pedidos da loja:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      mensagem:
        error.message ||
        'Não foi possível buscar os pedidos da loja.'
    });
  }
}


// ======================================================
// ATUALIZAR STATUS
// ======================================================

export async function atualizarStatusPedido(
  req: Request,
  res: Response
) {
  try {

    const pedido =
      await pedidoService.atualizarStatusPedido(
        String(req.params.id),
        req.body.status
      );

    return res.status(200).json({
      mensagem:
        'Status do pedido atualizado com sucesso.',
      pedido
    });

  } catch (error: any) {

    console.error(
      'Erro ao atualizar status do pedido:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      mensagem:
        error.message ||
        'Não foi possível atualizar o status do pedido.',
      ...(error.statusPermitidos && {
        statusPermitidos:
          error.statusPermitidos
      })
    });
  }
}


// ======================================================
// CANCELAR
// ======================================================

export async function cancelarPedido(
  req: Request,
  res: Response
) {
  try {

    const pedido =
      await pedidoService.cancelarPedido(
        String(req.params.id)
      );

    return res.status(200).json({
      mensagem:
        'Pedido cancelado com sucesso.',
      pedido
    });

  } catch (error: any) {

    console.error(
      'Erro ao cancelar pedido:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      mensagem:
        error.message ||
        'Não foi possível cancelar o pedido.'
    });
  }
}