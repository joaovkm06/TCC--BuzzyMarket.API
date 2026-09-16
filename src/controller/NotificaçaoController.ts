
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

  try {

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

  } catch (error: any) {

    console.error(
      'Erro ao criar notificação:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao criar notificação.',

      ...(error.tiposPermitidos && {

        tiposPermitidos:
          error.tiposPermitidos

      })

    });

  }

}


// =====================================================
// LISTAR TODAS
// =====================================================

export async function listarNotificacoes(
  req: AuthRequest,
  res: Response
) {

  try {

    const notificacoes =
      await notificacaoService
        .listarNotificacoes();


    return res.status(200).json(
      notificacoes
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar notificações:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao buscar notificações.'

    });

  }

}


// =====================================================
// BUSCAR POR ID
// =====================================================

export async function buscarNotificacaoPorId(
  req: AuthRequest,
  res: Response
) {

  try {

    const notificacao =
      await notificacaoService
        .buscarNotificacaoPorId(
          String(req.params.id)
        );


    return res.status(200).json(
      notificacao
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar notificação:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Não foi possível buscar a notificação.'

    });

  }

}


// =====================================================
// LISTAR MINHAS NOTIFICAÇÕES
// =====================================================

export async function listarNotificacoesPorUsuario(
  req: AuthRequest,
  res: Response
) {

  try {

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

  } catch (error: any) {

    console.error(
      'Erro ao buscar notificações do usuário:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Não foi possível buscar as notificações.'

    });

  }

}


// =====================================================
// MARCAR COMO LIDA / NÃO LIDA
// =====================================================

export async function atualizarLeitura(
  req: AuthRequest,
  res: Response
) {

  try {

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

  } catch (error: any) {

    console.error(
      'Erro ao atualizar notificação:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao atualizar notificação.'

    });

  }

}


// =====================================================
// MARCAR TODAS COMO LIDAS
// =====================================================

export async function marcarTodasComoLidas(
  req: AuthRequest,
  res: Response
) {

  try {

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

  } catch (error: any) {

    console.error(
      'Erro ao marcar notificações como lidas:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao marcar notificações como lidas.'

    });

  }

}


// =====================================================
// EXCLUIR
// =====================================================

export async function excluirNotificacao(
  req: AuthRequest,
  res: Response
) {

  try {

    await notificacaoService
      .excluirNotificacao(
        String(req.params.id)
      );


    return res.status(200).json({

      mensagem:
        'Notificação excluída com sucesso.'

    });

  } catch (error: any) {

    console.error(
      'Erro ao excluir notificação:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Não foi possível excluir a notificação.'

    });

  }

}

