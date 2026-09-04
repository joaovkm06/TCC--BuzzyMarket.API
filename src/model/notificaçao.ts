import { model, Schema } from 'mongoose';

export type TipoNotificacao =
  | 'loja_pendente'
  | 'loja_aprovada'
  | 'loja_rejeitada'
  | 'pedido'
  | 'pagamento'
  | 'sistema';

export interface Notificacao {
  id: string;
  usuarioId: string;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  lida: boolean;
  criadoEm: Date;
}

const notificacaoSchema = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    titulo: {
      type: String,
      required: true,
      trim: true
    },

    mensagem: {
      type: String,
      required: true,
      trim: true
    },

    tipo: {
      type: String,
      enum: [
        'loja_pendente',
        'loja_aprovada',
        'loja_rejeitada',
        'pedido',
        'pagamento',
        'sistema'
      ],
      required: true
    },

    lida: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: false
    }
  }
);

export const NotificacaoModel = model<Notificacao>(
  'Notificacao',
  notificacaoSchema
);