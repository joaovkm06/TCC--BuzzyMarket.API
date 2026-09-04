
import { model, Schema, Document } from 'mongoose';

export enum UserProfile {
  Cliente = 'cliente',
  Logista = 'logista',
  ADMIN = 'admin'
}

export interface User extends Document {
  nome: string;
  email: string;
  senhaHash: string;
  perfil: UserProfile;
}

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
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<User>('User', userSchema);

