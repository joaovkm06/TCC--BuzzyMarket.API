
import { Router } from 'express';

import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  listarProdutosPorLoja,
  atualizarProduto,
  atualizarEstoque,
  atualizarAtivo,
  excluirProduto
} from '../controller/ProdutoController';

import { autenticar } from '../middleware/AuthMiddleware';
import { permitirPerfis } from '../middleware/RoleMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';

import { UserProfile } from '../model/usuario';

const router = Router();

// ==========================================
// ROTAS PÚBLICAS
// ==========================================

// Listar todos os produtos
router.get(
  '/',
  asyncHandler(listarProdutos)
);

// Produtos de uma loja
// Deve ficar antes de /:id
router.get(
  '/loja/:lojaId',
  asyncHandler(listarProdutosPorLoja)
);

// Buscar produto por ID
router.get(
  '/:id',
  asyncHandler(buscarProdutoPorId)
);

// ==========================================
// ROTAS PROTEGIDAS
// ==========================================

// Criar produto
// Somente lojista ou admin
router.post(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(criarProduto)
);

// Atualizar produto
// Somente lojista ou admin
// O Controller verifica se o lojista é dono da loja
router.put(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(atualizarProduto)
);

// Atualizar estoque
// Somente lojista ou admin
router.patch(
  '/:id/estoque',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(atualizarEstoque)
);

// Ativar / desativar produto
// Somente lojista ou admin
router.patch(
  '/:id/ativo',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(atualizarAtivo)
);

// Excluir produto
// Somente lojista ou admin
router.delete(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(excluirProduto)
);

export default router;

