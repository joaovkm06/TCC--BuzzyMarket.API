

import { Request } from 'express';
import { TokenPayload } from '../types/TokenPayLoad';

export interface AuthRequest extends Request {
  usuario?: TokenPayload;
}


