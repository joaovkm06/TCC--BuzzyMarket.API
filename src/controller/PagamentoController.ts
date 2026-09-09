import {
  Request,
  Response
} from 'express';

import * as pagamentoService
  from '../service/PagamentoServices';


// =====================================================
// CRIAR PAGAMENTO
// =====================================================

export async function criarPagamento(
  req: Request,
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
  req: Request,
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
  req: Request,
  res: Response
) {

  try {

    const pagamento =
      await pagamentoService
        .buscarPagamentoPorPedido(

          String(
            req.params.pedidoId
          )

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
  req: Request,
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
  req: Request,
  res: Response
) {

  try {

    const pagamento =
      await pagamentoService
        .atualizarStatusPagamento(

          String(
            req.params.id
          ),

          req.body.status

        );


    return res.status(200).json({

      mensagem:
        'Status do pagamento atualizado com sucesso.',

      pagamento

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
  req: Request,
  res: Response
) {

  try {

    const pagamento =
      await pagamentoService
        .cancelarPagamento(

          String(
            req.params.id
          )

        );


    return res.status(200).json({

      mensagem:
        'Pagamento cancelado com sucesso.',

      pagamento

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