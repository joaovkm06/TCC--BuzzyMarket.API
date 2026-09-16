
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
import { UserProfile } from '../model/usuario';

const router = Router();

// ======================================================
// POST /users
// CADASTRO PÚBLICO DE CLIENTE
// ======================================================

router.post(
  '/',
  criarUsuario
);


// ======================================================
// POST /funcionarios
// LISTAR FUNCIONÁRIOS DA PRÓPRIA LOJA
// LOJISTA OU ADMIN


router.get(
  '/funcionarios',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  listarFuncionariosDaLoja
);


// ======================================================
// POST /users/lojista
// CADASTRO PÚBLICO DE LOJISTA
// ======================================================

router.post(
  '/lojista',
  criarLogista
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
  criarFuncionario
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
  criarAdmin
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
  contratarFuncionario
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
  listarUsuarios
);


// ======================================================
// GET /users/:id
// PRÓPRIO USUÁRIO OU ADMIN
// ======================================================

router.get(
  '/:id',
  autenticar,
  permitirProprioOuAdmin,
  buscarUsuario
);


// ======================================================
// PUT /users/:id
// PRÓPRIO USUÁRIO OU ADMIN
// ======================================================

router.put(
  '/:id',
  autenticar,
  permitirProprioOuAdmin,
  atualizarUsuario
);


// ======================================================
// DELETE /users/:id
// SOMENTE ADMIN
// ======================================================

router.delete(
  '/:id',
  autenticar,
  permitirPerfis(UserProfile.ADMIN),
  excluirUsuario
);

export default router;

