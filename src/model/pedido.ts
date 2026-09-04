import { model, Schema } from 'mongoose';

export type StatusPedido =
  | 'pendente'
  | 'confirmado'
  | 'preparando'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

export interface ItemPedido {
  produtoId: string;
  nome: string;
  quantidade: number;
  preco: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  usuarioId: string;
  lojaId: string;
  itens: ItemPedido[];
  valorTotal: number;
  status: StatusPedido;
  criadoEm: Date;
}

const itemPedidoSchema = new Schema(
  {
    produtoId: {
      type: Schema.Types.ObjectId,
      ref: 'Produto',
      required: true
    },

    nome: {
      type: String,
      required: true
    },

    quantidade: {
      type: Number,
      required: true,
      min: 1
    },

    preco: {
      type: Number,
      required: true,
      min: 0
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const pedidoSchema = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    lojaId: {
      type: Schema.Types.ObjectId,
      ref: 'Loja',
      required: true
    },

    itens: {
      type: [itemPedidoSchema],
      required: true,
      validate: {
        validator: (itens: ItemPedido[]) => itens.length > 0,
        message: 'O pedido precisa possuir pelo menos um item.'
      }
    },

    valorTotal: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: [
        'pendente',
        'confirmado',
        'preparando',
        'enviado',
        'entregue',
        'cancelado'
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

export const PedidoModel = model<Pedido>(
  'Pedido',
  pedidoSchema
);