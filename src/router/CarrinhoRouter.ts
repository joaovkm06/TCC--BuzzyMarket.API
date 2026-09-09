import { Router } from 'express';

import {
  adicionarItem,
  buscarCarrinho,
  atualizarQuantidade,
  removerItem,
  limparCarrinho
} from '../controller/CarrinhoController';

const router = Router();

// Adicionar produto ao carrinho
router.post('/itens', adicionarItem);

// Buscar carrinho do usuário
router.get('/usuario/:usuarioId', buscarCarrinho);

// Alterar quantidade de um produto
router.patch(
  '/usuario/:usuarioId/itens/:produtoId',
  atualizarQuantidade
);

// Remover produto
router.delete(
  '/usuario/:usuarioId/itens/:produtoId',
  removerItem
);

// Limpar carrinho
router.delete(
  '/usuario/:usuarioId',
  limparCarrinho
);

export default router;