
import { Request, Response } from 'express';

import * as produtoService from '../service/ProdutoService';
import * as produtoRepository from '../repository/ProdutoRepository';
import * as lojaRepository from '../repository/LojaRepository';

import { AuthRequest } from '../types/AuthRequest';
import { UserProfile } from '../model/usuario';

import { AppError } from '../error/AppError';


// ==========================================
// CRIAR PRODUTO
// ==========================================

export async function criarProduto(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {
    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }

  const { lojaId } = req.body;

  if (!lojaId) {
    throw new AppError(
      'Informe a loja do produto.',
      400
    );
  }

  // ==========================================
  // ADMIN
  // ==========================================

  const ehAdmin =
    req.usuario.perfil === UserProfile.ADMIN;

  // ==========================================
  // LOGISTA
  // ==========================================

  if (!ehAdmin) {

    if (
      req.usuario.perfil !== UserProfile.Logista
    ) {
      throw new AppError(
        'Somente lojistas podem cadastrar produtos.',
        403
      );
    }

    const loja =
      await lojaRepository.buscarLojaPorIdSemPopulate(
        lojaId
      );

    if (!loja) {
      throw new AppError(
        'Loja não encontrada.',
        404
      );
    }

    const ehProprietario =
      loja.proprietarioId.toString() ===
      String(req.usuario.id);

    if (!ehProprietario) {
      throw new AppError(
        'Você só pode cadastrar produtos na sua própria loja.',
        403
      );
    }
  }

  const produto =
    await produtoService.criarProduto(
      req.body
    );

  return res.status(201).json({
    mensagem: 'Produto criado com sucesso.',
    produto
  });
}


// ==========================================
// LISTAR PRODUTOS
// ==========================================

export async function listarProdutos(
  req: Request,
  res: Response
) {

  const produtos =
    await produtoService.listarProdutos();

  return res.status(200).json(
    produtos
  );
}


// ==========================================
// BUSCAR PRODUTO POR ID
// ==========================================

export async function buscarProdutoPorId(
  req: Request,
  res: Response
) {

  const id =
    String(req.params.id);

  const produto =
    await produtoService.buscarProdutoPorId(
      id
    );

  return res.status(200).json(
    produto
  );
}


// ==========================================
// LISTAR PRODUTOS DA LOJA
// ==========================================

export async function listarProdutosPorLoja(
  req: Request,
  res: Response
) {

  const lojaId =
    String(req.params.lojaId);

  const resultado =
    await produtoService.listarProdutosPorLoja(
      lojaId
    );

  return res.status(200).json(
    resultado
  );
}


// ==========================================
// ATUALIZAR PRODUTO
// ==========================================

export async function atualizarProduto(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {
    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }

  const id =
    String(req.params.id);

  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );

  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }

  const ehAdmin =
    req.usuario.perfil === UserProfile.ADMIN;

  if (!ehAdmin) {

    if (
      req.usuario.perfil !== UserProfile.Logista
    ) {
      throw new AppError(
        'Somente lojistas podem atualizar produtos.',
        403
      );
    }

    const loja =
      await lojaRepository.buscarLojaPorIdSemPopulate(
        produto.lojaId.toString()
      );

    if (!loja) {
      throw new AppError(
        'A loja do produto não foi encontrada.',
        404
      );
    }

    const ehProprietario =
      loja.proprietarioId.toString() ===
      String(req.usuario.id);

    if (!ehProprietario) {
      throw new AppError(
        'Você só pode alterar produtos da sua própria loja.',
        403
      );
    }
  }

  // ==========================================
  // NÃO PERMITIR ALTERAÇÃO DO LOJAID
  // ==========================================

  const dadosAtualizacao = {
    ...req.body
  };

  delete dadosAtualizacao.lojaId;

  const produtoAtualizado =
    await produtoService.atualizarProduto(
      id,
      dadosAtualizacao
    );

  return res.status(200).json({
    mensagem:
      'Produto atualizado com sucesso.',
    produto: produtoAtualizado
  });
}


// ==========================================
// ATUALIZAR ESTOQUE
// ==========================================

export async function atualizarEstoque(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {
    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }

  const id =
    String(req.params.id);

  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );

  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }

  const ehAdmin =
    req.usuario.perfil === UserProfile.ADMIN;

  if (!ehAdmin) {

    if (
      req.usuario.perfil !== UserProfile.Logista
    ) {
      throw new AppError(
        'Somente lojistas podem alterar o estoque.',
        403
      );
    }

    const loja =
      await lojaRepository.buscarLojaPorIdSemPopulate(
        produto.lojaId.toString()
      );

    if (!loja) {
      throw new AppError(
        'Loja não encontrada.',
        404
      );
    }

    if (
      loja.proprietarioId.toString() !==
      String(req.usuario.id)
    ) {
      throw new AppError(
        'Você só pode alterar o estoque dos produtos da sua loja.',
        403
      );
    }
  }

  const { estoque } =
    req.body;

  const resultado =
    await produtoService.atualizarEstoque(
      id,
      estoque
    );

  return res.status(200).json({
    mensagem:
      'Estoque atualizado com sucesso.',
    produto: resultado
  });
}


// ==========================================
// ATIVAR / DESATIVAR PRODUTO
// ==========================================

export async function atualizarAtivo(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {
    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }

  const id =
    String(req.params.id);

  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );

  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }

  const ehAdmin =
    req.usuario.perfil === UserProfile.ADMIN;

  if (!ehAdmin) {

    if (
      req.usuario.perfil !== UserProfile.Logista
    ) {
      throw new AppError(
        'Somente lojistas podem alterar o status do produto.',
        403
      );
    }

    const loja =
      await lojaRepository.buscarLojaPorIdSemPopulate(
        produto.lojaId.toString()
      );

    if (!loja) {
      throw new AppError(
        'Loja não encontrada.',
        404
      );
    }

    if (
      loja.proprietarioId.toString() !==
      String(req.usuario.id)
    ) {
      throw new AppError(
        'Você só pode alterar produtos da sua loja.',
        403
      );
    }
  }

  const { ativo } =
    req.body;

  const resultado =
    await produtoService.atualizarAtivo(
      id,
      ativo
    );

  return res.status(200).json({
    mensagem: ativo
      ? 'Produto ativado com sucesso.'
      : 'Produto desativado com sucesso.',
    produto: resultado
  });
}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

export async function excluirProduto(
  req: AuthRequest,
  res: Response
) {

  if (!req.usuario) {
    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }

  const id =
    String(req.params.id);

  const produto =
    await produtoRepository.buscarProdutoSemPopulate(
      id
    );

  if (!produto) {
    throw new AppError(
      'Produto não encontrado.',
      404
    );
  }

  const ehAdmin =
    req.usuario.perfil === UserProfile.ADMIN;

  if (!ehAdmin) {

    if (
      req.usuario.perfil !== UserProfile.Logista
    ) {
      throw new AppError(
        'Somente lojistas podem excluir produtos.',
        403
      );
    }

    const loja =
      await lojaRepository.buscarLojaPorIdSemPopulate(
        produto.lojaId.toString()
      );

    if (!loja) {
      throw new AppError(
        'Loja não encontrada.',
        404
      );
    }

    if (
      loja.proprietarioId.toString() !==
      String(req.usuario.id)
    ) {
      throw new AppError(
        'Você só pode excluir produtos da sua própria loja.',
        403
      );
    }
  }

  await produtoService.excluirProduto(
    id
  );

  return res.status(200).json({
    mensagem:
      'Produto excluído com sucesso.'
  });
}

