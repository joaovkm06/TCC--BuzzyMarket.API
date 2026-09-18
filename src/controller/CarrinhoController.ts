
import { Response } from 'express';

import * as carrinhoService
  from '../service/CarrinhoService';

import { AuthRequest } from '../types/AuthRequest';

// =====================================================
// ADICIONAR ITEM
// =====================================================

export async function adicionarItem(
  req: AuthRequest,
  res: Response
) {

  const {
    produtoId,
    quantidade
  } = req.body;

  const usuarioId =
    req.usuario!.id;

  const carrinho =
    await carrinhoService.adicionarItem(
      usuarioId,
      String(produtoId),
      Number(quantidade)
    );

  return res.status(200).json({

    mensagem:
      'Produto adicionado ao carrinho com sucesso.',

    carrinho

  });
}

// =====================================================
// BUSCAR MEU CARRINHO
// =====================================================

export async function buscarCarrinho(
  req: AuthRequest,
  res: Response
) {

  const usuarioId =
    req.usuario!.id;

  const carrinho =
    await carrinhoService.buscarCarrinho(
      usuarioId
    );

  return res.status(200).json(
    carrinho
  );
}

// =====================================================
// ATUALIZAR QUANTIDADE
// =====================================================

export async function atualizarQuantidade(
  req: AuthRequest,
  res: Response
) {

  const usuarioId =
    req.usuario!.id;

  const produtoId =
    String(
      req.params.produtoId
    );

  const {
    quantidade
  } = req.body;

  const carrinho =
    await carrinhoService.atualizarQuantidade(
      usuarioId,
      produtoId,
      Number(quantidade)
    );

  return res.status(200).json({

    mensagem:
      'Quantidade atualizada com sucesso.',

    carrinho

  });
}

// =====================================================
// REMOVER ITEM
// =====================================================

export async function removerItem(
  req: AuthRequest,
  res: Response
) {

  const usuarioId =
    req.usuario!.id;

  const produtoId =
    String(
      req.params.produtoId
    );

  const carrinho =
    await carrinhoService.removerItem(
      usuarioId,
      produtoId
    );

  return res.status(200).json({

    mensagem:
      'Produto removido do carrinho com sucesso.',

    carrinho

  });
}

// =====================================================
// LIMPAR CARRINHO
// =====================================================

export async function limparCarrinho(
  req: AuthRequest,
  res: Response
) {

  const usuarioId =
    req.usuario!.id;

  const carrinho =
    await carrinhoService.limparCarrinho(
      usuarioId
    );

  return res.status(200).json({

    mensagem:
      'Carrinho limpo com sucesso.',

    carrinho

  });
}
