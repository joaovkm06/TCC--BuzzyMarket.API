
import { model, Schema, Types, Document } from 'mongoose';


export type TipoNotificacao =
  | 'loja'
  | 'pedido'
  | 'pagamento'
  | 'sistema'
  | 'personalizada';


export interface Notificacao extends Document {

  id: string;

  remetenteId?: Types.ObjectId;

  usuarioId: Types.ObjectId;

  titulo: string;

  mensagem: string;

  tipo: TipoNotificacao;

  lida: boolean;

  criadoEm: Date;

}


const notificacaoSchema = new Schema<Notificacao>(

  {

    // Quem enviou a notificação
    remetenteId: {

      type: Schema.Types.ObjectId,

      ref: 'User',

      required: false

    },


    // Quem recebeu
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

        'loja',

        'pedido',

        'pagamento',

        'sistema',

        'personalizada'

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

