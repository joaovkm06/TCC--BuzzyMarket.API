
import { Response } from 'express';

import * as pagamentoService
  from '../service/PagamentoServices';

import { AuthRequest } from '../types/AuthRequest';

import { UserProfile } from '../model/usuario';

import * as pedidoRepository
  from '../repository/PedidoRepository';


// =====================================================
// CRIAR PAGAMENTO
// =====================================================

export async function criarPagamento(
  req: AuthRequest,
  res: Response
) {

  try {

    const pagamento =
      await pagamentoService
        .criarPagamento(
          req.body
        );


    return res.status(201).json({

      mensagem:
        'Pagamento criado com sucesso.',

      pagamento

    });

  } catch (error: any) {

    console.error(
      'Erro ao criar pagamento:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao criar pagamento.',

      ...(error.metodosPermitidos && {
        metodosPermitidos:
          error.metodosPermitidos
      }),

      ...(error.pagamentoId && {
        pagamentoId:
          error.pagamentoId
      }),

      ...(error.valorPedido !== undefined && {
        valorPedido:
          error.valorPedido
      }),

      ...(error.valorInformado !== undefined && {
        valorInformado:
          error.valorInformado
      })

    });
  }
}


// =====================================================
// LISTAR TODOS
// =====================================================

export async function listarPagamentos(
  req: AuthRequest,
  res: Response
) {

  try {

    const pagamentos =
      await pagamentoService
        .listarPagamentos();


    return res.status(200).json(
      pagamentos
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar pagamentos:',
      error
    );


    return res.status(500).json({

      mensagem:
        'Erro interno ao buscar pagamentos.',

      erro: error.message

    });
  }
}


// =====================================================
// BUSCAR POR PEDIDO
// =====================================================

export async function buscarPagamentoPorPedido(
  req: AuthRequest,
  res: Response
) {

  try {

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

      return res.status(404).json({

        mensagem:
          'Pedido não encontrado.'

      });
    }


    // =================================================
    // ADMIN PODE ACESSAR QUALQUER PEDIDO
    // =================================================

    if (
      req.usuario?.perfil !==
      UserProfile.ADMIN
    ) {

      // ===============================================
      // CLIENTE
      // ===============================================

      if (
        req.usuario?.perfil ===
        UserProfile.Cliente
      ) {

        if (
          String(pedido.usuarioId) !==
          String(req.usuario.id)
        ) {

          return res.status(403).json({

            mensagem:
              'Você não tem permissão para acessar este pagamento.'

          });
        }
      }


      // ===============================================
      // LOGISTA / FUNCIONÁRIO
      // ===============================================

      else if (

        req.usuario?.perfil ===
        UserProfile.Logista ||

        req.usuario?.perfil ===
        UserProfile.Funcionario

      ) {

        if (
          !req.usuario.lojaId ||
          String(pedido.lojaId) !==
          String(req.usuario.lojaId)
        ) {

          return res.status(403).json({

            mensagem:
              'Você não tem permissão para acessar este pagamento.'

          });
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

  } catch (error: any) {

    console.error(
      'Erro ao buscar pagamento:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Não foi possível buscar o pagamento.'

    });
  }
}


// =====================================================
// BUSCAR POR ID
// =====================================================

export async function buscarPagamentoPorId(
  req: AuthRequest,
  res: Response
) {

  try {

    const pagamento =
      await pagamentoService
        .buscarPagamentoPorId(

          String(
            req.params.id
          )

        );


    if (!pagamento) {

      return res.status(404).json({

        mensagem:
          'Pagamento não encontrado.'

      });
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

      return res.status(404).json({

        mensagem:
          'Pedido relacionado ao pagamento não encontrado.'

      });
    }


    // =================================================
    // ADMIN
    // =================================================

    if (
      req.usuario?.perfil !==
      UserProfile.ADMIN
    ) {

      // ===============================================
      // CLIENTE
      // ===============================================

      if (
        req.usuario?.perfil ===
        UserProfile.Cliente
      ) {

        if (
          String(pedido.usuarioId) !==
          String(req.usuario.id)
        ) {

          return res.status(403).json({

            mensagem:
              'Você não tem permissão para acessar este pagamento.'

          });
        }
      }


      // ===============================================
      // LOGISTA / FUNCIONÁRIO
      // ===============================================

      else if (

        req.usuario?.perfil ===
        UserProfile.Logista ||

        req.usuario?.perfil ===
        UserProfile.Funcionario

      ) {

        if (
          !req.usuario.lojaId ||
          String(pedido.lojaId) !==
          String(req.usuario.lojaId)
        ) {

          return res.status(403).json({

            mensagem:
              'Você não tem permissão para acessar este pagamento.'

          });
        }

      }

    }


    return res.status(200).json(
      pagamento
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar pagamento:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Não foi possível buscar o pagamento.'

    });
  }
}


// =====================================================
// ATUALIZAR STATUS
// =====================================================

export async function atualizarStatusPagamento(
  req: AuthRequest,
  res: Response
) {

  try {

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

      return res.status(404).json({

        mensagem:
          'Pagamento não encontrado.'

      });
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

      return res.status(404).json({

        mensagem:
          'Pedido relacionado ao pagamento não encontrado.'

      });
    }


    // =================================================
    // ADMIN
    // =================================================

    if (
      req.usuario?.perfil !==
      UserProfile.ADMIN
    ) {

      // Apenas logista e funcionário podem alterar
      // o status de pagamento.

      if (

        req.usuario?.perfil !==
        UserProfile.Logista &&

        req.usuario?.perfil !==
        UserProfile.Funcionario

      ) {

        return res.status(403).json({

          mensagem:
            'Você não tem permissão para alterar o status do pagamento.'

        });
      }


      // Verifica se pertence à loja do usuário.

      if (
        !req.usuario.lojaId ||
        String(pedido.lojaId) !==
        String(req.usuario.lojaId)
      ) {

        return res.status(403).json({

          mensagem:
            'Você não tem permissão para alterar este pagamento.'

        });
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

  } catch (error: any) {

    console.error(
      'Erro ao atualizar pagamento:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao atualizar pagamento.',

      ...(error.statusPermitidos && {
        statusPermitidos:
          error.statusPermitidos
      })

    });
  }
}


// =====================================================
// CANCELAR
// =====================================================

export async function cancelarPagamento(
  req: AuthRequest,
  res: Response
) {

  try {

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

      return res.status(404).json({

        mensagem:
          'Pagamento não encontrado.'

      });

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

      return res.status(404).json({

        mensagem:
          'Pedido relacionado ao pagamento não encontrado.'

      });

    }


    // =================================================
    // ADMIN
    // =================================================

    if (
      req.usuario?.perfil !==
      UserProfile.ADMIN
    ) {

      // ===============================================
      // CLIENTE
      // ===============================================

      if (
        req.usuario?.perfil ===
        UserProfile.Cliente
      ) {

        if (
          String(pedido.usuarioId) !==
          String(req.usuario.id)
        ) {

          return res.status(403).json({

            mensagem:
              'Você não tem permissão para cancelar este pagamento.'

          });

        }

      }


      // ===============================================
      // LOGISTA / FUNCIONÁRIO
      // ===============================================

      else if (

        req.usuario?.perfil ===
        UserProfile.Logista ||

        req.usuario?.perfil ===
        UserProfile.Funcionario

      ) {

        if (
          !req.usuario.lojaId ||
          String(pedido.lojaId) !==
          String(req.usuario.lojaId)
        ) {

          return res.status(403).json({

            mensagem:
              'Você não tem permissão para cancelar este pagamento.'

          });

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

  } catch (error: any) {

    console.error(
      'Erro ao cancelar pagamento:',
      error
    );


    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao cancelar pagamento.'

    });
  }
}

