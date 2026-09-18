
import { Types } from 'mongoose';

import { MetodoPagamento } from '../model/pagamento';

export class AppError extends Error {

  public readonly statusCode: number;

  public estoqueDisponivel?: number;
  public quantidadeSolicitada?: number;

  public statusPermitidos?: string[];

  public metodosPermitidos?: MetodoPagamento[];

  public pagamentoId?: Types.ObjectId;
  public tiposPermitidos?: string[];

  public valorPedido?: number;
  public valorInformado?: number;

  constructor(
    mensagem: string,
    statusCode: number = 500
  ) {
    super(mensagem);

    this.name = 'AppError';
    this.statusCode = statusCode;

    Object.setPrototypeOf(
      this,
      AppError.prototype
    );
  }
}

