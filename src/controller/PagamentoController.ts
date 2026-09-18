
import { Response } from 'express';

import * as pagamentoService
  from '../service/PagamentoServices';

import { AuthRequest } from '../types/AuthRequest';

import { UserProfile } from '../model/usuario';

import * as pedidoRepository
  from '../repository/PedidoRepository';

import { AppError } from '../error/AppError';


// =====================================================
// CRIAR PAGAMENTO
// =====================================================

export async function criarPagamento(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {

    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }


  const pagamento =
    await pagamentoService.criarPagamento(
      {
        ...req.body,
        usuarioId: req.usuario.id
      }
    );


  return res.status(201).json({

    mensagem:
      'Pagamento criado com sucesso.',

    pagamento

  });
}


// =====================================================
// LISTAR TODOS
// =====================================================

export async function listarPagamentos(
  req: AuthRequest,
  res: Response
) {

  const pagamentos =
    await pagamentoService.listarPagamentos();


  return res.status(200).json(
    pagamentos
  );
}


// =====================================================
// BUSCAR POR PEDIDO
// =====================================================

export async function buscarPagamentoPorPedido(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {

    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }


  const pedidoId =
    String(
      req.params.pedidoId
    );


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


  // =================================================
  // ADMIN PODE ACESSAR QUALQUER PEDIDO
  // =================================================

  if (
    req.usuario.perfil !==
    UserProfile.ADMIN
  ) {

    // ===============================================
    // CLIENTE
    // ===============================================

    if (
      req.usuario.perfil ===
      UserProfile.Cliente
    ) {

      if (
        String(pedido.usuarioId) !==
        String(req.usuario.id)
      ) {

        throw new AppError(
          'Você não tem permissão para acessar este pagamento.',
          403
        );
      }
    }


    // ===============================================
    // LOGISTA / FUNCIONÁRIO
    // ===============================================

    else if (

      req.usuario.perfil ===
      UserProfile.Logista ||

      req.usuario.perfil ===
      UserProfile.Funcionario

    ) {

      if (
        !req.usuario.lojaId ||
        String(pedido.lojaId) !==
        String(req.usuario.lojaId)
      ) {

        throw new AppError(
          'Você não tem permissão para acessar este pagamento.',
          403
        );
      }
    }
  }


  const pagamento =
    await pagamentoService
      .buscarPagamentoPorPedido(
        pedidoId
      );


  return res.status(200).json(
    pagamento
  );
}


// =====================================================
// BUSCAR POR ID
// =====================================================

export async function buscarPagamentoPorId(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {

    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }


  const pagamento =
    await pagamentoService
      .buscarPagamentoPorId(
        String(
          req.params.id
        )
      );


  if (!pagamento) {

    throw new AppError(
      'Pagamento não encontrado.',
      404
    );
  }


  // =================================================
  // BUSCAR PEDIDO RELACIONADO
  // =================================================

  const pedidoId =
    String(
      pagamento.pedidoId
    );


  const pedido =
    await pedidoRepository
      .buscarPedidoSemPopulate(
        pedidoId
      );


  if (!pedido) {

    throw new AppError(
      'Pedido relacionado ao pagamento não encontrado.',
      404
    );
  }


  // =================================================
  // ADMIN
  // =================================================

  if (
    req.usuario.perfil !==
    UserProfile.ADMIN
  ) {

    // ===============================================
    // CLIENTE
    // ===============================================

    if (
      req.usuario.perfil ===
      UserProfile.Cliente
    ) {

      if (
        String(pedido.usuarioId) !==
        String(req.usuario.id)
      ) {

        throw new AppError(
          'Você não tem permissão para acessar este pagamento.',
          403
        );
      }
    }


    // ===============================================
    // LOGISTA / FUNCIONÁRIO
    // ===============================================

    else if (

      req.usuario.perfil ===
      UserProfile.Logista ||

      req.usuario.perfil ===
      UserProfile.Funcionario

    ) {

      if (
        !req.usuario.lojaId ||
        String(pedido.lojaId) !==
        String(req.usuario.lojaId)
      ) {

        throw new AppError(
          'Você não tem permissão para acessar este pagamento.',
          403
        );
      }
    }
  }


  return res.status(200).json(
    pagamento
  );
}


// =====================================================
// ATUALIZAR STATUS
// =====================================================

export async function atualizarStatusPagamento(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {

    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }


  const pagamentoId =
    String(
      req.params.id
    );


  const pagamento =
    await pagamentoService
      .buscarPagamentoPorId(
        pagamentoId
      );


  if (!pagamento) {

    throw new AppError(
      'Pagamento não encontrado.',
      404
    );
  }


  // =================================================
  // BUSCAR PEDIDO
  // =================================================

  const pedido =
    await pedidoRepository
      .buscarPedidoSemPopulate(
        String(
          pagamento.pedidoId
        )
      );


  if (!pedido) {

    throw new AppError(
      'Pedido relacionado ao pagamento não encontrado.',
      404
    );
  }


  // =================================================
  // ADMIN
  // =================================================

  if (
    req.usuario.perfil !==
    UserProfile.ADMIN
  ) {

    // Apenas logista e funcionário podem alterar
    // o status de pagamento.

    if (

      req.usuario.perfil !==
      UserProfile.Logista &&

      req.usuario.perfil !==
      UserProfile.Funcionario

    ) {

      throw new AppError(
        'Você não tem permissão para alterar o status do pagamento.',
        403
      );
    }


    // Verifica se pertence à loja do usuário.

    if (
      !req.usuario.lojaId ||
      String(pedido.lojaId) !==
      String(req.usuario.lojaId)
    ) {

      throw new AppError(
        'Você não tem permissão para alterar este pagamento.',
        403
      );
    }
  }


  const pagamentoAtualizado =
    await pagamentoService
      .atualizarStatusPagamento(

        pagamentoId,

        req.body.status

      );


  return res.status(200).json({

    mensagem:
      'Status do pagamento atualizado com sucesso.',

    pagamento:
      pagamentoAtualizado

  });
}


// =====================================================
// CANCELAR
// =====================================================

export async function cancelarPagamento(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {

    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }


  const pagamentoId =
    String(
      req.params.id
    );


  const pagamento =
    await pagamentoService
      .buscarPagamentoPorId(
        pagamentoId
      );


  if (!pagamento) {

    throw new AppError(
      'Pagamento não encontrado.',
      404
    );
  }


  // =================================================
  // BUSCAR PEDIDO
  // =================================================

  const pedido =
    await pedidoRepository
      .buscarPedidoSemPopulate(
        String(
          pagamento.pedidoId
        )
      );


  if (!pedido) {

    throw new AppError(
      'Pedido relacionado ao pagamento não encontrado.',
      404
    );
  }


  // =================================================
  // ADMIN
  // =================================================

  if (
    req.usuario.perfil !==
    UserProfile.ADMIN
  ) {

    // ===============================================
    // CLIENTE
    // ===============================================

    if (
      req.usuario.perfil ===
      UserProfile.Cliente
    ) {

      if (
        String(pedido.usuarioId) !==
        String(req.usuario.id)
      ) {

        throw new AppError(
          'Você não tem permissão para cancelar este pagamento.',
          403
        );
      }
    }


    // ===============================================
    // LOGISTA / FUNCIONÁRIO
    // ===============================================

    else if (

      req.usuario.perfil ===
      UserProfile.Logista ||

      req.usuario.perfil ===
      UserProfile.Funcionario

    ) {

      if (
        !req.usuario.lojaId ||
        String(pedido.lojaId) !==
        String(req.usuario.lojaId)
      ) {

        throw new AppError(
          'Você não tem permissão para cancelar este pagamento.',
          403
        );
      }
    }
  }


  const pagamentoCancelado =
    await pagamentoService
      .cancelarPagamento(
        pagamentoId
      );


  return res.status(200).json({

    mensagem:
      'Pagamento cancelado com sucesso.',

    pagamento:
      pagamentoCancelado

  });
}

