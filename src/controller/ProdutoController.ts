import { Request, Response } from 'express';
import * as produtoService from '../service/ProdutoService';


// ==========================================
// CRIAR PRODUTO
// ==========================================

export async function criarProduto(
  req: Request,
  res: Response
) {
  try {

    const produto = await produtoService.criarProduto(
      req.body
    );

    return res.status(201).json({
      mensagem: 'Produto criado com sucesso.',
      produto
    });

  } catch (error: any) {

    console.error('Erro ao criar produto:', error);

    return res.status(error.status || 400).json({
      mensagem:
        error.message ||
        'Não foi possível criar o produto.'
    });
  }
}


// ==========================================
// LISTAR PRODUTOS
// ==========================================

export async function listarProdutos(
  req: Request,
  res: Response
) {
  try {

    const produtos =
      await produtoService.listarProdutos();

    return res.status(200).json(produtos);

  } catch (error: any) {

    console.error('Erro ao buscar produtos:', error);

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível buscar os produtos.'
    });
  }
}


// ==========================================
// BUSCAR PRODUTO POR ID
// ==========================================

export async function buscarProdutoPorId(
  req: Request,
  res: Response
) {
  try {

    const id = String(req.params.id);

    const produto =
      await produtoService.buscarProdutoPorId(id);

    return res.status(200).json(produto);

  } catch (error: any) {

    console.error('Erro ao buscar produto:', error);

    return res.status(error.status || 400).json({
      mensagem:
        error.message ||
        'Não foi possível buscar o produto.'
    });
  }
}


// ==========================================
// LISTAR PRODUTOS DA LOJA
// ==========================================

export async function listarProdutosPorLoja(
  req: Request,
  res: Response
) {
  try {

    const lojaId = String(req.params.lojaId);

    const resultado =
      await produtoService.listarProdutosPorLoja(
        lojaId
      );

    return res.status(200).json(resultado);

  } catch (error: any) {

    console.error(
      'Erro ao buscar produtos da loja:',
      error
    );

    return res.status(error.status || 400).json({
      mensagem:
        error.message ||
        'Não foi possível buscar os produtos da loja.'
    });
  }
}


// ==========================================
// ATUALIZAR PRODUTO
// ==========================================

export async function atualizarProduto(
  req: Request,
  res: Response
) {
  try {

    const id = String(req.params.id);

    const produto =
      await produtoService.atualizarProduto(
        id,
        req.body
      );

    return res.status(200).json({
      mensagem: 'Produto atualizado com sucesso.',
      produto
    });

  } catch (error: any) {

    console.error(
      'Erro ao atualizar produto:',
      error
    );

    return res.status(error.status || 400).json({
      mensagem:
        error.message ||
        'Não foi possível atualizar o produto.'
    });
  }
}


// ==========================================
// ATUALIZAR ESTOQUE
// ==========================================

export async function atualizarEstoque(
  req: Request,
  res: Response
) {
  try {

    const id = String(req.params.id);

    const { estoque } = req.body;

    const produto =
      await produtoService.atualizarEstoque(
        id,
        estoque
      );

    return res.status(200).json({
      mensagem: 'Estoque atualizado com sucesso.',
      produto
    });

  } catch (error: any) {

    console.error(
      'Erro ao atualizar estoque:',
      error
    );

    return res.status(error.status || 400).json({
      mensagem:
        error.message ||
        'Não foi possível atualizar o estoque.'
    });
  }
}


// ==========================================
// ATIVAR / DESATIVAR PRODUTO
// ==========================================

export async function atualizarAtivo(
  req: Request,
  res: Response
) {
  try {

    const id = String(req.params.id);

    const { ativo } = req.body;

    const produto =
      await produtoService.atualizarAtivo(
        id,
        ativo
      );

    return res.status(200).json({
      mensagem: ativo
        ? 'Produto ativado com sucesso.'
        : 'Produto desativado com sucesso.',
      produto
    });

  } catch (error: any) {

    console.error(
      'Erro ao alterar status do produto:',
      error
    );

    return res.status(error.status || 400).json({
      mensagem:
        error.message ||
        'Não foi possível alterar o status do produto.'
    });
  }
}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

export async function excluirProduto(
  req: Request,
  res: Response
) {
  try {

    const id = String(req.params.id);

    await produtoService.excluirProduto(id);

    return res.status(200).json({
      mensagem: 'Produto excluído com sucesso.'
    });

  } catch (error: any) {

    console.error(
      'Erro ao excluir produto:',
      error
    );

    return res.status(error.status || 400).json({
      mensagem:
        error.message ||
        'Não foi possível excluir o produto.'
    });
  }
}