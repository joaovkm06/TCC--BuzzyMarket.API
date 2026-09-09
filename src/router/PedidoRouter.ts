import { Router } from 'express';

import {
  criarPedido,
  listarPedidos,
  buscarPedidoPorId,
  listarPedidosPorUsuario,
  listarPedidosPorLoja,
  atualizarStatusPedido,
  cancelarPedido
} from '../controller/PedidoController';

const router = Router();


// ======================================================
// PEDIDOS
// ======================================================

// Criar pedido
router.post(
  '/',
  criarPedido
);

// Listar todos os pedidos
router.get(
  '/',
  listarPedidos
);

// Listar pedidos por usuário
router.get(
  '/usuario/:usuarioId',
  listarPedidosPorUsuario
);

// Listar pedidos por loja
router.get(
  '/loja/:lojaId',
  listarPedidosPorLoja
);

// Buscar pedido por ID
router.get(
  '/:id',
  buscarPedidoPorId
);

// Atualizar status
router.patch(
  '/:id/status',
  atualizarStatusPedido
);

// Cancelar pedido
router.delete(
  '/:id',
  cancelarPedido
);

export default router;