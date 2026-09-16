
import {
  model,
  Schema,
  Types,
  Document
} from 'mongoose';


// =====================================================
// ITEM DO CARRINHO
// =====================================================

export interface ItemCarrinho {
  produtoId: Types.ObjectId;
  nome: string;
  preco: number;
  imagem?: string;
  quantidade: number;
}


// =====================================================
// CARRINHO
// =====================================================

export interface Carrinho extends Document {
  usuarioId: Types.ObjectId;
  itens: ItemCarrinho[];
  atualizadoEm: Date;
}


// =====================================================
// SCHEMA DO ITEM
// =====================================================

const itemCarrinhoSchema =
  new Schema<ItemCarrinho>(
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
        required: false,
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


// =====================================================
// SCHEMA DO CARRINHO
// =====================================================

const carrinhoSchema =
  new Schema<Carrinho>(
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


// =====================================================
// MODEL
// =====================================================

export const CarrinhoModel =
  model<Carrinho>(
    'Carrinho',
    carrinhoSchema
  );

