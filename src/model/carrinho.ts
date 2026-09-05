
import { model, Schema } from 'mongoose';

export interface ItemCarrinho {
  produtoId: string;
  nome: string;
  preco: number;
  imagem?: string;
  quantidade: number;
}

export interface Carrinho {
  id: string;
  usuarioId: string;
  itens: ItemCarrinho[];
  atualizadoEm: Date;
}

const itemCarrinhoSchema = new Schema(
  {
    produtoId: {
      type: Schema.Types.ObjectId,
      ref: 'Produto',
      required: true
    },

    nome: {
      type: String,
      required: true,
      trim: true
    },

    preco: {
      type: Number,
      required: true,
      min: 0
    },

    imagem: {
      type: String,
      trim: true
    },

    quantidade: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    _id: false
  }
);

const carrinhoSchema = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    itens: {
      type: [itemCarrinhoSchema],
      default: []
    }
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: 'atualizadoEm'
    }
  }
);

export const CarrinhoModel = model<Carrinho>(
  'Carrinho',
  carrinhoSchema
);