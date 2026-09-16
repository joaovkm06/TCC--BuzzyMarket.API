
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
  listarLojas
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
  buscarMinhaLoja
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
  criarLoja
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
  atualizarLoja
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
  atualizarHorarios
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
  atualizarStatusLoja
);


// ======================================================
// VERIFICAR SE A LOJA ESTÁ ABERTA
// ======================================================

router.get(
  '/:id/aberta',
  verificarLojaAberta
);


// ======================================================
// BUSCAR LOJA POR ID
// ======================================================

router.get(
  '/:id',
  buscarLojaPorId
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
  excluirLoja
);


export default router;

