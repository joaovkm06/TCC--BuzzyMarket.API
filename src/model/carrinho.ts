import { model, Schema } from 'mongoose';

export interface ItemCarrinho {
  produtoId: string;
  quantidade: number;
  preço: number;
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

    quantidade: {
      type: Number,
      required: true,
      min: 1
    },
    preço:{
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