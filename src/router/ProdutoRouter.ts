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


const router = Router();




// Criar produto
router.post(
  '/',
  criarProduto
);


// Listar todos
router.get(
  '/',
  listarProdutos
);


// Produtos de uma loja
// Deve ficar antes de /:id
router.get(
  '/loja/:lojaId',
  listarProdutosPorLoja
);


// Buscar por ID
router.get(
  '/:id',
  buscarProdutoPorId
);


// Atualizar produto
router.put(
  '/:id',
  atualizarProduto
);


// Atualizar estoque
router.patch(
  '/:id/estoque',
  atualizarEstoque
);


// Ativar/desativar
router.patch(
  '/:id/ativo',
  atualizarAtivo
);


// Excluir
router.delete(
  '/:id',
  excluirProduto
);


export default router;