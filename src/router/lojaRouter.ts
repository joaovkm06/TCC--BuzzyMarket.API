import { Router } from 'express';

import {
  criarLoja,
  listarLojas,
  buscarLojaPorId,
  atualizarLoja,
  atualizarHorarios,
  atualizarStatusLoja,
  verificarLojaAberta,
  excluirLoja
} from '../controller/LpjaController';


const router = Router();

  

// Criar loja
router.post(
  '/',
  criarLoja
);


// Listar lojas
router.get(
  '/',
  listarLojas
);



router.get(
  '/:id/aberta',
  verificarLojaAberta
);


// Buscar loja por ID
router.get(
  '/:id',
  buscarLojaPorId
);


// Atualizar dados
router.put(
  '/:id',
  atualizarLoja
);


// Atualizar horários
router.put(
  '/:id/horarios',
  atualizarHorarios
);


// Atualizar status
router.patch(
  '/:id/status',
  atualizarStatusLoja
);


// Excluir loja
router.delete(
  '/:id',
  excluirLoja
);


export default router;