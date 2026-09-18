
import { Response } from 'express';

import * as notificacaoService
  from '../service/NotificaçaoService';

import { AuthRequest } from '../types/AuthRequest';

// =====================================================
// CRIAR
// =====================================================

export async function criarNotificacao(
  req: AuthRequest,
  res: Response
) {

  const notificacao =
    await notificacaoService.criarNotificacao({

      ...req.body,

      // Remetente vem do usuário autenticado
      remetenteId: req.usuario!.id

    });

  return res.status(201).json({

    mensagem:
      'Notificação criada com sucesso.',

    notificacao

  });
}

// =====================================================
// LISTAR TODAS
// =====================================================

export async function listarNotificacoes(
  req: AuthRequest,
  res: Response
) {

  const notificacoes =
    await notificacaoService
      .listarNotificacoes();

  return res.status(200).json(
    notificacoes
  );
}

// =====================================================
// BUSCAR POR ID
// =====================================================

export async function buscarNotificacaoPorId(
  req: AuthRequest,
  res: Response
) {

  const notificacao =
    await notificacaoService
      .buscarNotificacaoPorId(
        String(req.params.id)
      );

  return res.status(200).json(
    notificacao
  );
}

// =====================================================
// LISTAR MINHAS NOTIFICAÇÕES
// =====================================================

export async function listarNotificacoesPorUsuario(
  req: AuthRequest,
  res: Response
) {

  // O usuário vem do JWT
  const usuarioId =
    req.usuario!.id;

  const resultado =
    await notificacaoService
      .listarNotificacoesPorUsuario(
        usuarioId
      );

  return res.status(200).json(
    resultado
  );
}

// =====================================================
// MARCAR COMO LIDA / NÃO LIDA
// =====================================================

export async function atualizarLeitura(
  req: AuthRequest,
  res: Response
) {

  const notificacao =
    await notificacaoService
      .atualizarLeitura(

        String(req.params.id),

        req.body.lida

      );

  return res.status(200).json({

    mensagem:
      req.body.lida
        ? 'Notificação marcada como lida.'
        : 'Notificação marcada como não lida.',

    notificacao

  });
}

// =====================================================
// MARCAR TODAS COMO LIDAS
// =====================================================

export async function marcarTodasComoLidas(
  req: AuthRequest,
  res: Response
) {

  // O usuário vem do JWT
  const usuarioId =
    req.usuario!.id;

  const resultado =
    await notificacaoService
      .marcarTodasComoLidas(
        usuarioId
      );

  return res.status(200).json({

    mensagem:
      'Todas as notificações foram marcadas como lidas.',

    notificacoesAtualizadas:
      resultado.notificacoesAtualizadas

  });
}

// =====================================================
// EXCLUIR
// =====================================================

export async function excluirNotificacao(
  req: AuthRequest,
  res: Response
) {

  await notificacaoService
    .excluirNotificacao(
      String(req.params.id)
    );

  return res.status(200).json({

    mensagem:
      'Notificação excluída com sucesso.'

  });
}

