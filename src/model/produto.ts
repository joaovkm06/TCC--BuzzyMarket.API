import { model, Schema } from 'mongoose';

export interface Produto {
  id: string;
  lojaId: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  imagem?: string;
  ativo: boolean;
  criadoEm: Date;
}

const produtoSchema = new Schema(
  {
    lojaId: {
      type: Schema.Types.ObjectId,
      ref: 'Loja',
      required: true
    },

    nome: {
      type: String,
      required: true,
      trim: true
    },

    descricao: {
      type: String,
      trim: true
    },

    preco: {
      type: Number,
      required: true,
      min: 0
    },

    estoque: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    imagem: {
      type: String
    },

    ativo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: false
    }
  }
);

export const ProdutoModel = model<Produto>(
  'Produto',
  produtoSchema
);