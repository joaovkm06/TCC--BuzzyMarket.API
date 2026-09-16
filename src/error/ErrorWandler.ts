
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
        mensagem: error.message
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
      mensagem: 'Erro interno do servidor.'
    });
}

