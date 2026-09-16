
import { model, Schema, Types, Document } from 'mongoose';


// ======================================================
// MÉTODOS DE PAGAMENTO
// ======================================================

export type MetodoPagamento =
  | 'pix'
  | 'cartao'
  | 'boleto';


// ======================================================
// STATUS DO PAGAMENTO
// ======================================================

export type StatusPagamento =
  | 'pendente'
  | 'aprovado'
  | 'recusado'
  | 'cancelado';


// ======================================================
// INTERFACE
// ======================================================

export interface Pagamento extends Document {
  pedidoId: Types.ObjectId;
  valor: number;
  metodo: MetodoPagamento;
  status: StatusPagamento;
  transacaoId?: string;
  criadoEm: Date;
}


// ======================================================
// SCHEMA
// ======================================================

const pagamentoSchema = new Schema<Pagamento>(
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
      enum: [
        'pix',
        'cartao',
        'boleto'
      ],
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
      type: String,
      required: false,
      trim: true
    }
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: false
    }
  }
);


// ======================================================
// MODEL
// ======================================================

export const PagamentoModel =
  model<Pagamento>(
    'Pagamento',
    pagamentoSchema
  );

