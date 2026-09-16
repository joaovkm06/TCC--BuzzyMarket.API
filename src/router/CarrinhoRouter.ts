
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

  adicionarItem

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

  buscarCarrinho

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

  atualizarQuantidade

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

  removerItem

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

  limparCarrinho

);


export default router;

