
import { Router } from 'express';

import {
  criarPagamento,
  listarPagamentos,
  buscarPagamentoPorPedido,
  buscarPagamentoPorId,
  atualizarStatusPagamento,
  cancelarPagamento
} from '../controller/PagamentoController';

import { autenticar } from '../middleware/AuthMiddleware';

import { permitirPerfis } from '../middleware/RoleMiddleware';

import { UserProfile } from '../model/usuario';


const router = Router();


// =====================================================
// CRIAR PAGAMENTO
// =====================================================

router.post(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente
  ),
  criarPagamento
);


// =====================================================
// LISTAR TODOS
// =====================================================

router.get(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.ADMIN
  ),
  listarPagamentos
);


// =====================================================
// BUSCAR PAGAMENTO DE UM PEDIDO
// =====================================================

router.get(
  '/pedido/:pedidoId',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Logista,
    UserProfile.Funcionario,
    UserProfile.ADMIN
  ),
  buscarPagamentoPorPedido
);


// =====================================================
// BUSCAR PAGAMENTO POR ID
// =====================================================

router.get(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Logista,
    UserProfile.Funcionario,
    UserProfile.ADMIN
  ),
  buscarPagamentoPorId
);


// =====================================================
// ATUALIZAR STATUS
// =====================================================

router.patch(
  '/:id/status',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.Funcionario,
    UserProfile.ADMIN
  ),
  atualizarStatusPagamento
);


// =====================================================
// CANCELAR PAGAMENTO
// =====================================================

router.delete(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Logista,
    UserProfile.Funcionario,
    UserProfile.ADMIN
  ),
  cancelarPagamento
);


export default router;

