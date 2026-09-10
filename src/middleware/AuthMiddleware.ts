
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  perfil: string;
  lojaId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  usuario?: TokenPayload;
}

export function autenticar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Pega o Authorization enviado pelo cliente
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensagem: 'Token nao informado.'
      });
    }

    // Esperamos: Bearer TOKEN
    const partes = authorization.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return res.status(401).json({
        mensagem: 'Formato do token invalido.'
      });
    }

    const token = partes[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        mensagem: 'JWT_SECRET nao configurado.'
      });
    }

    // Verifica se o token é válido
    const payload = jwt.verify(
      token,
      jwtSecret
    ) as TokenPayload;

    // Guarda os dados do usuário na requisição
    req.usuario = payload;

    // Libera a requisição
    next();

  } catch (error) {
    return res.status(401).json({
      mensagem: 'Token invalido ou expirado.'
    });
  }
}

