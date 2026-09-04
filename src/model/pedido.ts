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

export interface EnderecoEntrega {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Pedido {
  id: string;
  usuarioId: string;
  lojaId: string;
  itens: ItemPedido[];
  valorTotal: number;
  enderecoEntrega: EnderecoEntrega;
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

const enderecoEntregaSchema = new Schema(
  {
    cep: {
      type: String,
      required: true,
      trim: true
    },

    logradouro: {
      type: String,
      required: true,
      trim: true
    },

    numero: {
      type: String,
      required: true,
      trim: true
    },

    complemento: {
      type: String,
      trim: true
    },

    bairro: {
      type: String,
      required: true,
      trim: true
    },

    cidade: {
      type: String,
      required: true,
      trim: true
    },

    estado: {
      type: String,
      required: true,
      trim: true
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

    enderecoEntrega: {
      type: enderecoEntregaSchema,
      required: true
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