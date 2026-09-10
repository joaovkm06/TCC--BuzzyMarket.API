
import { Router } from 'express';

import {
  criarUsuario,
  criarLogista,
  criarFuncionario,
  criarAdmin,
  contratarFuncionario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario
} from '../controller/UsuarioController';

import { autenticar } from '../middleware/AuthMiddleware';
import { permitirPerfis } from '../middleware/RoleMiddleware';
import { UserProfile } from '../model/usuario';

const router = Router();


// ======================================================
// POST /users
// CADASTRO PÚBLICO
// Sempre cria CLIENTE
// ======================================================

router.post(
  '/',
  criarUsuario
);


// ======================================================
// POST /users/lojista
// CADASTRO PÚBLICO
// Sempre cria LOJISTA
// ======================================================

router.post(
  '/lojista',
  criarLogista
);


// ======================================================
// POST /users/funcionario
// CRIAÇÃO DIRETA DE FUNCIONÁRIO
// Apenas LOJISTA ou ADMIN
// ======================================================

router.post(
  '/funcionario',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  criarFuncionario
);


// ======================================================
// POST /users/admin
// CRIAR ADMIN
// Apenas ADMIN
// ======================================================

router.post(
  '/admin',
  autenticar,
  permitirPerfis(
    UserProfile.ADMIN
  ),
  criarAdmin
);


// ======================================================
// PATCH /users/:id/funcionario
// CONTRATAR CLIENTE
//
// LOJISTA → funcionário da própria loja
// ADMIN   → funcionário da loja informada
// ======================================================

router.patch(
  '/:id/funcionario',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  contratarFuncionario
);


// ======================================================
// GET /users
// LISTAR USUÁRIOS
// Apenas ADMIN
// ======================================================

router.get(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.ADMIN
  ),
  listarUsuarios
);


// ======================================================
// GET /users/:id
// BUSCAR USUÁRIO
// Usuário autenticado
// ======================================================

router.get(
  '/:id',
  autenticar,
  buscarUsuario
);


// ======================================================
// PUT /users/:id
// ATUALIZAR USUÁRIO
// Usuário autenticado
// ======================================================

router.put(
  '/:id',
  autenticar,
  atualizarUsuario
);


// ======================================================
// DELETE /users/:id
// EXCLUIR USUÁRIO
// Apenas ADMIN
// ======================================================

router.delete(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.ADMIN
  ),
  excluirUsuario
);


export default router;

