import { Router } from 'express';

import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario
} from '../controller/UsuarioController';

const router = Router();


// POST /users
router.post(
  '/',
  criarUsuario
);


// GET /users
router.get(
  '/',
  listarUsuarios
);


// GET /users/:id
router.get(
  '/:id',
  buscarUsuario
);


// PUT /users/:id
router.put(
  '/:id',
  atualizarUsuario
);


// DELETE /users/:id
router.delete(
  '/:id',
  excluirUsuario
);


export default router;