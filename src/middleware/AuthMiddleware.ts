
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AuthRequest } from '../types/AuthRequest';
import { TokenPayload } from '../types/TokenPayLoad';

export function autenticar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensagem: 'Token nao informado.'
      });
    }

    const partes = authorization.split(' ');

    if (
      partes.length !== 2 ||
      partes[0] !== 'Bearer'
    ) {
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

    const payload = jwt.verify(
      token,
      jwtSecret
    ) as TokenPayload;

    req.usuario = payload;

    next();

  } catch (error) {
    return res.status(401).json({
      mensagem: 'Token invalido ou expirado.'
    });
  }
}


export { AuthRequest };
