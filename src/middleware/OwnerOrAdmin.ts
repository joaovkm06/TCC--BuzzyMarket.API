import { Response, NextFunction } from 'express';
import { AuthRequest } from './AuthMiddleware';
import { UserProfile } from '../model/usuario';

export function permitirProprioOuAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.usuario) {
    return res.status(401).json({
      mensagem: 'Usuário não autenticado.'
    });
  }

  const usuarioLogadoId = String(req.usuario.id);
  const usuarioAlvoId = String(req.params.id);

  const ehAdmin =
    req.usuario.perfil === UserProfile.ADMIN;

  const ehProprioUsuario =
    usuarioLogadoId === usuarioAlvoId;

  if (!ehAdmin && !ehProprioUsuario) {
    return res.status(403).json({
      mensagem:
        'Você só pode acessar seu próprio usuário.'
    });
  }

  next();
}