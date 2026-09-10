
import { Response, NextFunction } from 'express';
import { AuthRequest } from './AuthMiddleware';
import { UserProfile } from '../model/usuario';

export function permitirPerfis(...perfisPermitidos: UserProfile[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {

    // Verifica se o usuário está autenticado
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Usuario nao autenticado.'
      });
    }

    // Verifica se o perfil do usuário está autorizado
    if (!perfisPermitidos.includes(req.usuario.perfil as UserProfile)) {
      return res.status(403).json({
        mensagem: 'Voce nao tem permissao para acessar este recurso.'
      });
    }

    // Perfil permitido
    next();
  };
}

