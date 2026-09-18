
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

import { autenticar } from '../middleware/AuthMiddleware';

import { permitirPerfis } from '../middleware/RoleMiddleware';

import { asyncHandler } from '../middleware/AsyncHandler';

import { UserProfile } from '../model/usuario';

const router = Router();


// ======================================================
// CRIAR PEDIDO
// ======================================================

// Apenas clientes podem criar pedidos
router.post(
  '/',
  autenticar,
  permitirPerfis(UserProfile.Cliente),
  asyncHandler(criarPedido)
);


// ======================================================
// LISTAR TODOS OS PEDIDOS
// ======================================================

// Admin pode visualizar todos os pedidos
router.get(
  '/',
  autenticar,
  permitirPerfis(UserProfile.ADMIN),
  asyncHandler(listarPedidos)
);


// ======================================================
// LISTAR PEDIDOS POR USUÁRIO
// ======================================================

// Cliente, admin e lojista podem acessar a rota.
// A verificação de propriedade/permissão específica
// deve ser feita no Controller.

router.get(
  '/usuario/:usuarioId',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(listarPedidosPorUsuario)
);


// ======================================================
// LISTAR PEDIDOS POR LOJA
// ======================================================

// Lojista, funcionário e admin podem visualizar
// pedidos relacionados à loja.

router.get(
  '/loja/:lojaId',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.Funcionario,
    UserProfile.ADMIN
  ),
  asyncHandler(listarPedidosPorLoja)
);


// ======================================================
// BUSCAR PEDIDO POR ID
// ======================================================

// Usuários autenticados podem consultar um pedido.
// A regra de quem pode ver cada pedido pode ser
// validada no Controller.

router.get(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Funcionario,
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(buscarPedidoPorId)
);


// ======================================================
// ATUALIZAR STATUS
// ======================================================

// Lojista, funcionário e admin podem atualizar status.

router.patch(
  '/:id/status',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.Funcionario,
    UserProfile.ADMIN
  ),
  asyncHandler(atualizarStatusPedido)
);


// ======================================================
// CANCELAR PEDIDO
// ======================================================

// Cliente, lojista e admin podem solicitar cancelamento.
// As regras de quando o cancelamento é permitido
// continuam no PedidoService.

router.delete(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(cancelarPedido)
);


export default router;

