import { model, Schema, Document } from 'mongoose';

export enum UserProfile {
  Cliente = 'cliente',
  Logista = 'logista',
  ADMIN = 'admin'
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface User extends Document {
  nome: string;
  email: string;
  senhaHash: string;
  perfil: UserProfile;
  endereco?: Endereco;
}

const enderecoSchema = new Schema<Endereco>(
  {
    cep: {
      type: String,
      trim: true
    },

    logradouro: {
      type: String,
      trim: true
    },

    numero: {
      type: String,
      trim: true
    },

    complemento: {
      type: String,
      trim: true
    },

    bairro: {
      type: String,
      trim: true
    },

    cidade: {
      type: String,
      trim: true
    },

    estado: {
      type: String,
      trim: true
    }
  },
  {
    _id: false
  }
);

const userSchema = new Schema<User>(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    senhaHash: {
      type: String,
      required: true
    },

    perfil: {
      type: String,
      enum: Object.values(UserProfile),
      required: true,
      default: UserProfile.Cliente
    },

    endereco: {
      type: enderecoSchema,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<User>('User', userSchema);