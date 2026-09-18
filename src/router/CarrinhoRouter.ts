
import { Router } from 'express';

import {
  adicionarItem,
  buscarCarrinho,
  atualizarQuantidade,
  removerItem,
  limparCarrinho
} from '../controller/CarrinhoController';

import { autenticar } from '../middleware/AuthMiddleware';
import { permitirPerfis } from '../middleware/RoleMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';
import { UserProfile } from '../model/usuario';

const router = Router();

// =====================================================
// ADICIONAR PRODUTO AO CARRINHO
// =====================================================

router.post(
  '/itens',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente
  ),
  asyncHandler(adicionarItem)
);

// =====================================================
// BUSCAR MEU CARRINHO
// =====================================================

router.get(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente
  ),
  asyncHandler(buscarCarrinho)
);

// =====================================================
// ALTERAR QUANTIDADE
// =====================================================

router.patch(
  '/itens/:produtoId',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente
  ),
  asyncHandler(atualizarQuantidade)
);

// =====================================================
// REMOVER PRODUTO
// =====================================================

router.delete(
  '/itens/:produtoId',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente
  ),
  asyncHandler(removerItem)
);

// =====================================================
// LIMPAR CARRINHO
// =====================================================

router.delete(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente
  ),
  asyncHandler(limparCarrinho)
);

export default router;


