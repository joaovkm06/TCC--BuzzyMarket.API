
import {
  model,
  Schema,
  Document,
  Types
} from 'mongoose';


// ======================================================
// PERFIS DO USUÁRIO
// ======================================================

export enum UserProfile {

  Cliente = 'cliente',

  Funcionario = 'funcionario',

  Logista = 'logista',

  ADMIN = 'admin'

}


// ======================================================
// ENDEREÇO
// ======================================================

export interface Endereco {

  cep: string;

  logradouro: string;

  numero: string;

  complemento?: string;

  bairro: string;

  cidade: string;

  estado: string;

}


// ======================================================
// INTERFACE DO USUÁRIO
// ======================================================

export interface User extends Document {

  nome: string;

  email: string;

  senhaHash: string;

  perfil: UserProfile;

  endereco?: Endereco;

  lojaId?: Types.ObjectId;

}


// ======================================================
// SCHEMA DO ENDEREÇO
// ======================================================

const enderecoSchema =
  new Schema<Endereco>(

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
        required: false,
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


// ======================================================
// SCHEMA DO USUÁRIO
// ======================================================

const userSchema =
  new Schema<User>(

    {

      // ==================================================
      // NOME
      // ==================================================

      nome: {
        type: String,
        required: true,
        trim: true
      },


      // ==================================================
      // E-MAIL
      // ==================================================

      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },


      // ==================================================
      // SENHA
      // ==================================================

      senhaHash: {
        type: String,
        required: true
      },


      // ==================================================
      // PERFIL
      // ==================================================

      perfil: {
        type: String,
        enum: Object.values(UserProfile),
        required: true,
        default: UserProfile.Cliente
      },


      // ==================================================
      // ENDEREÇO
      // ==================================================

      endereco: {
        type: enderecoSchema,
        required: false
      },


      // ==================================================
      // LOJA
      // ==================================================

      lojaId: {
        type: Schema.Types.ObjectId,
        ref: 'Loja',
        required: false
      }

    },

    {
      timestamps: true
    }

  );


// ======================================================
// MODEL
// ======================================================

export const UserModel =
  model<User>(
    'User',
    userSchema
  );

