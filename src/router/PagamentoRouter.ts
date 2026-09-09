import { Router } from 'express';

import {
  criarPagamento,
  listarPagamentos,
  buscarPagamentoPorPedido,
  buscarPagamentoPorId,
  atualizarStatusPagamento,
  cancelarPagamento
} from '../controller/PagamentoController';

const router = Router();



// Criar pagamento
router.post(
  '/',
  criarPagamento
);


// Listar todos
router.get(
  '/',
  listarPagamentos
);


// Buscar pagamento de um pedido
router.get(
  '/pedido/:pedidoId',
  buscarPagamentoPorPedido
);


// Buscar pagamento por ID
router.get(
  '/:id',
  buscarPagamentoPorId
);


// Atualizar status
router.patch(
  '/:id/status',
  atualizarStatusPagamento
);


// Cancelar pagamento
router.delete(
  '/:id',
  cancelarPagamento
);


export default router;