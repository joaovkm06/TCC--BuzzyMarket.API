
import { Request, Response } from 'express';

import * as lojaService
  from '../service/LojaService';

import { AuthRequest } from '../types/AuthRequest';

import {
  UserProfile
} from '../model/usuario';

import { AppError } from '../error/AppError';

// ======================================================
// CRIAR LOJA
// ======================================================

export async function criarLoja(
  req: AuthRequest,
  res: Response
) {

  const proprietarioId =
    String(req.usuario!.id);

  const loja =
    await lojaService.criarLoja(
      req.body,
      proprietarioId
    );

  return res.status(201).json({

    mensagem:
      'Loja criada com sucesso.',

    loja

  });
}

// ======================================================
// LISTAR LOJAS
// ======================================================

export async function listarLojas(
  req: Request,
  res: Response
) {

  const lojas =
    await lojaService.listarLojas();

  return res.status(200).json(
    lojas
  );
}

// ======================================================
// BUSCAR LOJA POR ID
// ======================================================

export async function buscarLojaPorId(
  req: Request,
  res: Response
) {

  const id =
    String(req.params.id);

  const loja =
    await lojaService.buscarLojaPorId(
      id
    );

  return res.status(200).json(
    loja
  );
}

// ======================================================
// BUSCAR MINHA LOJA
// ======================================================

export async function buscarMinhaLoja(
  req: AuthRequest,
  res: Response
) {

  const loja =
    await lojaService
      .buscarLojaDoProprietario(
        String(req.usuario!.id)
      );

  return res.status(200).json(
    loja
  );
}

// ======================================================
// ATUALIZAR LOJA
// ======================================================

export async function atualizarLoja(
  req: AuthRequest,
  res: Response
) {

  const id =
    String(req.params.id);

  // ====================================================
  // BUSCAR LOJA
  // ====================================================

  const loja =
    await lojaService
      .buscarLojaPorId(id);

  // ====================================================
  // VERIFICAR PERMISSÃO
  // ====================================================

  const ehAdmin =
    req.usuario!.perfil ===
    UserProfile.ADMIN;

  const ehProprietario =
    loja.proprietarioId.toString() ===
    String(req.usuario!.id);

  if (
    !ehAdmin &&
    !ehProprietario
  ) {

    throw new AppError(
      'Você só pode alterar sua própria loja.',
      403
    );

  }

  // ====================================================
  // CAMPOS PERMITIDOS
  // ====================================================

  const dadosAtualizacao = {

    nome:
      req.body.nome,

    descricao:
      req.body.descricao,

    categoria:
      req.body.categoria,

    foto:
      req.body.foto,

    banner:
      req.body.banner,

    telefone:
      req.body.telefone,

    endereco:
      req.body.endereco

  };

  // ====================================================
  // ATUALIZAR
  // ====================================================

  const lojaAtualizada =
    await lojaService
      .atualizarLoja(
        id,
        dadosAtualizacao
      );

  return res.status(200).json({

    mensagem:
      'Loja atualizada com sucesso.',

    loja:
      lojaAtualizada

  });
}

// ======================================================
// ATUALIZAR HORÁRIOS
// ======================================================

export async function atualizarHorarios(
  req: AuthRequest,
  res: Response
) {

  const id =
    String(req.params.id);

  // ====================================================
  // BUSCAR LOJA
  // ====================================================

  const loja =
    await lojaService
      .buscarLojaPorId(id);

  // ====================================================
  // VERIFICAR PERMISSÃO
  // ====================================================

  const ehAdmin =
    req.usuario!.perfil ===
    UserProfile.ADMIN;

  const ehProprietario =
    loja.proprietarioId.toString() ===
    String(req.usuario!.id);

  if (
    !ehAdmin &&
    !ehProprietario
  ) {

    throw new AppError(
      'Você só pode alterar os horários da sua própria loja.',
      403
    );

  }

  // ====================================================
  // HORÁRIOS
  // ====================================================

  const horarios =
    req.body.horarios;

  // ====================================================
  // ATUALIZAR
  // ====================================================

  const lojaAtualizada =
    await lojaService
      .atualizarHorarios(
        id,
        horarios
      );

  return res.status(200).json({

    mensagem:
      'Horários da loja atualizados com sucesso.',

    horarios:
      lojaAtualizada.horarios

  });
}

// ======================================================
// ATUALIZAR STATUS
// ======================================================

export async function atualizarStatusLoja(
  req: AuthRequest,
  res: Response
) {

  const id =
    String(req.params.id);

  const status =
    req.body.status;

  // ====================================================
  // ATUALIZAR STATUS
  // ====================================================

  const loja =
    await lojaService
      .atualizarStatusLoja(
        id,
        status
      );

  return res.status(200).json({

    mensagem:
      'Status da loja atualizado com sucesso.',

    status:
      loja.status

  });
}

// ======================================================
// VERIFICAR SE A LOJA ESTÁ ABERTA
// ======================================================

export async function verificarLojaAberta(
  req: Request,
  res: Response
) {

  const id =
    String(req.params.id);

  const resultado =
    await lojaService
      .verificarLojaAberta(id);

  return res.status(200).json(
    resultado
  );
}

// ======================================================
// EXCLUIR LOJA
// ======================================================

export async function excluirLoja(
  req: AuthRequest,
  res: Response
) {

  const id =
    String(req.params.id);

  // ====================================================
  // BUSCAR LOJA
  // ====================================================

  const loja =
    await lojaService
      .buscarLojaPorId(id);

  // ====================================================
  // VERIFICAR PERMISSÃO
  // ====================================================

  const ehAdmin =
    req.usuario!.perfil ===
    UserProfile.ADMIN;

  const ehProprietario =
    loja.proprietarioId.toString() ===
    String(req.usuario!.id);

  if (
    !ehAdmin &&
    !ehProprietario
  ) {

    throw new AppError(
      'Você só pode excluir sua própria loja.',
      403
    );

  }

  // ====================================================
  // EXCLUIR
  // ====================================================

  await lojaService
    .excluirLoja(id);

  return res.status(200).json({

    mensagem:
      'Loja excluída com sucesso.'

  });
}

