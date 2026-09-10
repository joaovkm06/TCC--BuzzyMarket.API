
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel } from '../model/usuario';

interface LoginDados {
  email: string;
  senha: string;
}

export async function login({ email, senha }: LoginDados) {

  console.log('=================================');
  console.log('EMAIL RECEBIDO:', email);
  console.log('SENHA RECEBIDA:', senha);

  const usuario = await UserModel.findOne({
    email: email.toLowerCase().trim()
  });

  console.log('USUARIO ENCONTRADO:', usuario);

  if (!usuario) {
    throw new Error('Email ou senha invalidos.');
  }

  console.log('EMAIL DO BANCO:', usuario.email);
  console.log('HASH DO BANCO:', usuario.senhaHash);

  const senhaValida = await bcrypt.compare(
    senha,
    usuario.senhaHash
  );

  console.log('SENHA VALIDA:', senhaValida);

  if (!senhaValida) {
    throw new Error('Email ou senha invalidos.');
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET nao configurado no .env.');
  }

  const token = jwt.sign(
    {
      id: usuario._id.toString(),
      perfil: usuario.perfil,
      lojaId: usuario.lojaId
        ? usuario.lojaId.toString()
        : undefined
    },
    jwtSecret,
    {
      expiresIn: '1d'
    }
  );

  return {
    token,
    usuario: {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      lojaId: usuario.lojaId
    }
  };
}

