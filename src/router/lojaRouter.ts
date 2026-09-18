
import { Router } from 'express';

import {
  criarLoja,
  listarLojas,
  buscarLojaPorId,
  buscarMinhaLoja,
  atualizarLoja,
  atualizarHorarios,
  atualizarStatusLoja,
  verificarLojaAberta,
  excluirLoja
} from '../controller/LojaController';

import { autenticar }
  from '../middleware/AuthMiddleware';

import { permitirPerfis }
  from '../middleware/RoleMiddleware';

import { asyncHandler }
  from '../middleware/AsyncHandler';

import { UserProfile }
  from '../model/usuario';

const router = Router();

// ======================================================
// LOJAS PÚBLICAS
// ======================================================

// ======================================================
// LISTAR LOJAS
// ======================================================

router.get(
  '/',
  asyncHandler(listarLojas)
);

// ======================================================
// ROTAS DO LOJISTA
// ======================================================

// ======================================================
// MINHA LOJA
// ======================================================

router.get(
  '/minha',
  autenticar,
  permitirPerfis(
    UserProfile.Logista
  ),
  asyncHandler(buscarMinhaLoja)
);

// ======================================================
// CRIAR LOJA
// ======================================================

router.post(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.Logista
  ),
  asyncHandler(criarLoja)
);

// ======================================================
// ATUALIZAR DADOS DA LOJA
// ======================================================

router.put(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(atualizarLoja)
);

// ======================================================
// ATUALIZAR HORÁRIOS
// ======================================================

router.put(
  '/:id/horarios',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(atualizarHorarios)
);

// ======================================================
// ROTAS DO ADMIN
// ======================================================

// ======================================================
// ALTERAR STATUS DA LOJA
// ======================================================

router.patch(
  '/:id/status',
  autenticar,
  permitirPerfis(
    UserProfile.ADMIN
  ),
  asyncHandler(atualizarStatusLoja)
);

// ======================================================
// VERIFICAR SE A LOJA ESTÁ ABERTA
// ======================================================

router.get(
  '/:id/aberta',
  asyncHandler(verificarLojaAberta)
);

// ======================================================
// BUSCAR LOJA POR ID
// ======================================================

router.get(
  '/:id',
  asyncHandler(buscarLojaPorId)
);

// ======================================================
// EXCLUIR LOJA
// ======================================================

router.delete(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(excluirLoja)
);

export default router;

