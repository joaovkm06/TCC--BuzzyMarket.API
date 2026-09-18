
import {
  Request,
  Response,
  NextFunction
} from 'express';

import { AppError } from './AppError';

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {

  // ======================================================
  // ERRO PERSONALIZADO
  // ======================================================

  if (error instanceof AppError) {

    return res
      .status(error.statusCode)
      .json({
        mensagem: error.message,

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
        }),

        ...(error.statusPermitidos && {
          statusPermitidos:
            error.statusPermitidos
        }),

        ...(error.estoqueDisponivel !== undefined && {
          estoqueDisponivel:
            error.estoqueDisponivel
        }),

        ...(error.quantidadeSolicitada !== undefined && {
          quantidadeSolicitada:
            error.quantidadeSolicitada
        }),

        ...(error.tiposPermitidos && {
          tiposPermitidos:
            error.tiposPermitidos
        })
      });
  }

  // ======================================================
  // ERRO NÃO TRATADO
  // ======================================================

  console.error(
    'Erro interno:',
    error
  );

  return res
    .status(500)
    .json({
      mensagem:
        'Erro interno do servidor.'
    });
}


