import { Router } from 'express';

import {
  criarNotificacao,
  listarNotificacoes,
  listarNotificacoesPorUsuario,
  buscarNotificacaoPorId,
  atualizarLeitura,
  marcarTodasComoLidas,
  excluirNotificacao
} from '../controller/NotificaçaoController';

const router = Router();


// =====================================================
// NOTIFICAÇÕES
// =====================================================

// Criar notificação
router.post(
  '/',
  criarNotificacao
);


// Listar todas
router.get(
  '/',
  listarNotificacoes
);


// Listar notificações de um usuário
router.get(
  '/usuario/:usuarioId',
  listarNotificacoesPorUsuario
);


// Marcar todas como lidas
router.patch(
  '/usuario/:usuarioId/lidas',
  marcarTodasComoLidas
);


// Buscar por ID
router.get(
  '/:id',
  buscarNotificacaoPorId
);


// Marcar como lida/não lida
router.patch(
  '/:id/lida',
  atualizarLeitura
);


// Excluir
router.delete(
  '/:id',
  excluirNotificacao
);


export default router;