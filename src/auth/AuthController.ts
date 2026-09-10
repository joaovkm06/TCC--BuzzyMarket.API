
import { Request, Response } from 'express';
import { login } from './AuthService';

export async function fazerLogin(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;

    const resultado = await login({
      email,
      senha
    });

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      ...resultado
    });

  } catch (error: any) {
    return res.status(401).json({
      mensagem: error.message || 'Erro ao realizar login.'
    });
  }
}

