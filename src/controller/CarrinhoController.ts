import { Request, Response } from 'express';

import * as carrinhoService from '../service/CarrinhoService';

export async function adicionarItem(
  req: Request,
  res: Response
) {
  try {
    const { usuarioId, produtoId, quantidade } = req.body;

    const carrinho =
      await carrinhoService.adicionarItem(
        String(usuarioId),
        String(produtoId),
        Number(quantidade)
      );

    return res.status(200).json({
      mensagem: 'Produto adicionado ao carrinho com sucesso.',
      carrinho
    });

  } catch (error: any) {

    return res.status(error.status || 500).json({
      mensagem:
        error.message || 'Erro ao adicionar produto ao carrinho.'
    });
  }
}

export async function buscarCarrinho(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = String(req.params.usuarioId);

    const carrinho =
      await carrinhoService.buscarCarrinho(usuarioId);

    return res.status(200).json(carrinho);

  } catch (error: any) {

    return res.status(error.status || 500).json({
      mensagem:
        error.message || 'Erro ao buscar carrinho.'
    });
  }
}

export async function atualizarQuantidade(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = String(req.params.usuarioId);
    const produtoId = String(req.params.produtoId);

    const { quantidade } = req.body;

    const carrinho =
      await carrinhoService.atualizarQuantidade(
        usuarioId,
        produtoId,
        Number(quantidade)
      );

    return res.status(200).json({
      mensagem: 'Quantidade atualizada com sucesso.',
      carrinho
    });

  } catch (error: any) {

    return res.status(error.status || 500).json({
      mensagem:
        error.message || 'Erro ao atualizar quantidade.'
    });
  }
}

export async function removerItem(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = String(req.params.usuarioId);
    const produtoId = String(req.params.produtoId);

    const carrinho =
      await carrinhoService.removerItem(
        usuarioId,
        produtoId
      );

    return res.status(200).json({
      mensagem: 'Produto removido do carrinho com sucesso.',
      carrinho
    });

  } catch (error: any) {

    return res.status(error.status || 500).json({
      mensagem:
        error.message || 'Erro ao remover produto do carrinho.'
    });
  }
}

export async function limparCarrinho(
  req: Request,
  res: Response
) {
  try {
    const usuarioId = String(req.params.usuarioId);

    const carrinho =
      await carrinhoService.limparCarrinho(usuarioId);

    return res.status(200).json({
      mensagem: 'Carrinho limpo com sucesso.',
      carrinho
    });

  } catch (error: any) {

    return res.status(error.status || 500).json({
      mensagem:
        error.message || 'Erro ao limpar carrinho.'
    });
  }
}