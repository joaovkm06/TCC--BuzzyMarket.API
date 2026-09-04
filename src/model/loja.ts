import { model, Schema } from 'mongoose';

export type StatusLoja =
  | 'pendente'
  | 'aprovada'
  | 'rejeitada'
  | 'bloqueada';

export type FuncionamentoLoja =
  | 'aberta'
  | 'fechada';

export interface Loja {
  id: string;
  nome: string;
  descricao?: string;
  categoria: string;
  proprietarioId: string;
  status: StatusLoja;
  funcionamento: FuncionamentoLoja;
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

    categoria: {
      type: String,
      required: true,
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
        'bloqueada'
      ],
      default: 'pendente',
      required: true
    },

    funcionamento: {
      type: String,
      enum: [
        'aberta',
        'fechada'
      ],
      default: 'fechada',
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

export const LojaModel = model<Loja>(
  'Loja',
  lojaSchema
);