import { model, Schema } from 'mongoose';

export type MetodoPagamento =
  | 'pix'
  | 'cartao'
  | 'boleto';

export type StatusPagamento =
  | 'pendente'
  | 'aprovado'
  | 'recusado'
  | 'cancelado';

export interface Pagamento {
  id: string;
  pedidoId: string;
  valor: number;
  metodo: MetodoPagamento;
  status: StatusPagamento;
  transacaoId?: string;
  criadoEm: Date;
}

const pagamentoSchema = new Schema(
  {
    pedidoId: {
      type: Schema.Types.ObjectId,
      ref: 'Pedido',
      required: true,
      unique: true
    },

    valor: {
      type: Number,
      required: true,
      min: 0
    },

    metodo: {
      type: String,
      enum: ['pix', 'cartao', 'boleto'],
      required: true
    },

    status: {
      type: String,
      enum: [
        'pendente',
        'aprovado',
        'recusado',
        'cancelado'
      ],
      default: 'pendente',
      required: true
    },

    transacaoId: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: false
    }
  }
);

export const PagamentoModel = model<Pagamento>(
  'Pagamento',
  pagamentoSchema
);