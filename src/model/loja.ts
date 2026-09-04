import { model, Schema } from 'mongoose';

export type StatusLoja =
  | 'pendente'
  | 'aprovada'
  | 'rejeitada'
  | 'bloqueada'
  | 'Aberta'
  | 'fechada'

export interface Loja {
  id: string;
  nome: string;
  descricao?: string;
  proprietarioId: string;
  status: StatusLoja;
  criadoEm: Date;
}

const lojaSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },

    descricao: {
      type: String,
      trim: true
    },

    proprietarioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: [
        'pendente',
        'aprovada',
        'rejeitada',
        'bloqueada',
        'Aberta',
        'fechada',

      ],
      default: 'pendente',
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: false
    }
  }
);

export const LojaModel = model<Loja>('Loja', lojaSchema);