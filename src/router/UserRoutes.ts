
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
  excluirUsuario,
  listarFuncionariosDaLoja
} from '../controller/UsuarioController';

import { autenticar } from '../middleware/AuthMiddleware';

import { permitirPerfis } from '../middleware/RoleMiddleware';

import { permitirProprioOuAdmin } from '../middleware/OwnerOrAdmin';

import { asyncHandler } from '../middleware/AsyncHandler';

import { UserProfile } from '../model/usuario';

const router = Router();

// ======================================================
// POST /users
// CADASTRO PÚBLICO DE CLIENTE
// ======================================================

router.post(
  '/',
  asyncHandler(criarUsuario)
);

// ======================================================
// GET /users/funcionarios
// LISTAR FUNCIONÁRIOS DA PRÓPRIA LOJA
// LOJISTA OU ADMIN
// ======================================================

router.get(
  '/funcionarios',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(listarFuncionariosDaLoja)
);

// ======================================================
// POST /users/lojista
// CADASTRO PÚBLICO DE LOJISTA
// ======================================================

router.post(
  '/lojista',
  asyncHandler(criarLogista)
);

// ======================================================
// POST /users/funcionario
// CRIAÇÃO DIRETA DE FUNCIONÁRIO
// SOMENTE ADMIN
// ======================================================

router.post(
  '/funcionario',
  autenticar,
  permitirPerfis(UserProfile.ADMIN),
  asyncHandler(criarFuncionario)
);

// ======================================================
// POST /users/admin
// CRIAR ADMIN
// SOMENTE ADMIN
// ======================================================

router.post(
  '/admin',
  autenticar,
  permitirPerfis(UserProfile.ADMIN),
  asyncHandler(criarAdmin)
);

// ======================================================
// PATCH /users/:id/funcionario
// LOJISTA OU ADMIN CONTRATA CLIENTE
// ======================================================

router.patch(
  '/:id/funcionario',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(contratarFuncionario)
);

// ======================================================
// GET /users
// LISTAR TODOS OS USUÁRIOS
// SOMENTE ADMIN
// ======================================================

router.get(
  '/',
  autenticar,
  permitirPerfis(UserProfile.ADMIN),
  asyncHandler(listarUsuarios)
);

// ======================================================
// GET /users/:id
// PRÓPRIO USUÁRIO OU ADMIN
// ======================================================

router.get(
  '/:id',
  autenticar,
  permitirProprioOuAdmin,
  asyncHandler(buscarUsuario)
);

// ======================================================
// PUT /users/:id
// PRÓPRIO USUÁRIO OU ADMIN
// ======================================================

router.put(
  '/:id',
  autenticar,
  permitirProprioOuAdmin,
  asyncHandler(atualizarUsuario)
);

// ======================================================
// DELETE /users/:id
// SOMENTE ADMIN
// ======================================================

router.delete(
  '/:id',
  autenticar,
  permitirPerfis(UserProfile.ADMIN),
  asyncHandler(excluirUsuario)
);

export default router;

