
import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import * as pedidoService from '../service/PedidoService';


// ======================================================
// CRIAR PEDIDO
// ======================================================

export async function criarPedido(
  req: AuthRequest,
  res: Response
) {
  try {

    // O usuário autenticado é o dono do pedido.
    // Não confiamos no usuarioId enviado pelo body.
    const dadosPedido = {
      ...req.body,
      usuarioId: req.usuario!.id
    };

    const pedido =
      await pedidoService.criarPedido(
        dadosPedido
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
  req: AuthRequest,
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
  req: AuthRequest,
  res: Response
) {
  try {

    const pedidoId =
      String(req.params.id);

    const pedido =
      await pedidoService.buscarPedidoPorId(
        pedidoId
      );

    if (!pedido) {

      return res.status(404).json({
        mensagem: 'Pedido não encontrado.'
      });

    }

    // ==================================================
    // ADMIN
    // ==================================================

    // Admin pode visualizar qualquer pedido.
    if (req.usuario!.perfil === 'admin') {

      return res.status(200).json(
        pedido
      );
    }


    // ==================================================
    // CLIENTE
    // ==================================================

    if (req.usuario!.perfil === 'cliente') {

      const usuarioId =
        pedido.usuarioId?._id
          ? pedido.usuarioId._id.toString()
          : pedido.usuarioId.toString();

      if (
        usuarioId !== req.usuario!.id
      ) {

        return res.status(403).json({
          mensagem:
            'Você não tem permissão para visualizar este pedido.'
        });

      }

      return res.status(200).json(
        pedido
      );
    }


    // ==================================================
    // LOJISTA / FUNCIONÁRIO
    // ==================================================

    if (
      req.usuario!.perfil === 'logista' ||
      req.usuario!.perfil === 'funcionario'
    ) {

      const lojaId =
        pedido.lojaId?._id
          ? pedido.lojaId._id.toString()
          : pedido.lojaId.toString();

      if (
        !req.usuario!.lojaId ||
        req.usuario!.lojaId !== lojaId
      ) {

        return res.status(403).json({
          mensagem:
            'Você não tem permissão para visualizar este pedido.'
        });

      }

      return res.status(200).json(
        pedido
      );
    }


    // ==================================================
    // PERFIL NÃO AUTORIZADO
    // ==================================================

    return res.status(403).json({
      mensagem:
        'Você não tem permissão para visualizar este pedido.'
    });

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
  req: AuthRequest,
  res: Response
) {
  try {

    const usuarioId =
      String(req.params.usuarioId);

    // Cliente só pode consultar
    // os próprios pedidos.
    if (
      req.usuario!.perfil === 'cliente' &&
      req.usuario!.id !== usuarioId
    ) {

      return res.status(403).json({
        mensagem:
          'Você não tem permissão para consultar os pedidos de outro usuário.'
      });

    }

    const resultado =
      await pedidoService.listarPedidosPorUsuario(
        usuarioId
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
  req: AuthRequest,
  res: Response
) {
  try {

    const lojaId =
      String(req.params.lojaId);

    // Admin pode consultar qualquer loja.
    if (req.usuario!.perfil !== 'admin') {

      // Lojista e funcionário só podem
      // consultar a loja à qual pertencem.
      if (
        !req.usuario!.lojaId ||
        req.usuario!.lojaId !== lojaId
      ) {

        return res.status(403).json({
          mensagem:
            'Você não tem permissão para consultar os pedidos desta loja.'
        });

      }
    }

    const resultado =
      await pedidoService.listarPedidosPorLoja(
        lojaId
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
  req: AuthRequest,
  res: Response
) {
  try {

    const pedidoId =
      String(req.params.id);

    // Busca o pedido antes de alterar
    // para verificar a loja.
    const pedido =
      await pedidoService.buscarPedidoPorId(
        pedidoId
      );

    if (!pedido) {

      return res.status(404).json({
        mensagem: 'Pedido não encontrado.'
      });

    }

    // Admin pode alterar qualquer pedido.
    if (req.usuario!.perfil !== 'admin') {

      const lojaId =
        pedido.lojaId?._id
          ? pedido.lojaId._id.toString()
          : pedido.lojaId.toString();

      // Lojista e funcionário precisam
      // pertencer à loja do pedido.
      if (
        !req.usuario!.lojaId ||
        req.usuario!.lojaId !== lojaId
      ) {

        return res.status(403).json({
          mensagem:
            'Você não tem permissão para alterar este pedido.'
        });

      }
    }

    const pedidoAtualizado =
      await pedidoService.atualizarStatusPedido(
        pedidoId,
        req.body.status
      );

    return res.status(200).json({
      mensagem:
        'Status do pedido atualizado com sucesso.',
      pedido: pedidoAtualizado
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
// CANCELAR PEDIDO
// ======================================================

export async function cancelarPedido(
  req: AuthRequest,
  res: Response
) {
  try {

    const pedidoId =
      String(req.params.id);

    // Busca o pedido para verificar
    // quem pode cancelar.
    const pedido =
      await pedidoService.buscarPedidoPorId(
        pedidoId
      );

    if (!pedido) {

      return res.status(404).json({
        mensagem: 'Pedido não encontrado.'
      });

    }


    // ==================================================
    // CLIENTE
    // ==================================================

    if (
      req.usuario!.perfil === 'cliente'
    ) {

      const usuarioId =
        pedido.usuarioId?._id
          ? pedido.usuarioId._id.toString()
          : pedido.usuarioId.toString();

      if (
        usuarioId !== req.usuario!.id
      ) {

        return res.status(403).json({
          mensagem:
            'Você não tem permissão para cancelar este pedido.'
        });

      }
    }


    // ==================================================
    // LOJISTA
    // ==================================================

    if (
      req.usuario!.perfil === 'logista'
    ) {

      const lojaId =
        pedido.lojaId?._id
          ? pedido.lojaId._id.toString()
          : pedido.lojaId.toString();

      if (
        !req.usuario!.lojaId ||
        req.usuario!.lojaId !== lojaId
      ) {

        return res.status(403).json({
          mensagem:
            'Você não tem permissão para cancelar este pedido.'
        });

      }
    }


    // ==================================================
    // ADMIN
    // ==================================================

    // Admin pode cancelar qualquer pedido.


    const pedidoCancelado =
      await pedidoService.cancelarPedido(
        pedidoId
      );

    return res.status(200).json({
      mensagem:
        'Pedido cancelado com sucesso.',
      pedido: pedidoCancelado
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


