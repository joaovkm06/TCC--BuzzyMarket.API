
import { Request, Response } from 'express';

import * as lojaService
  from '../service/LojaService';

import { AuthRequest } from '../types/AuthRequest';

import {
  UserProfile
} from '../model/usuario';


// ======================================================
// CRIAR LOJA
// ======================================================

export async function criarLoja(
  req: AuthRequest,
  res: Response
) {

  try {

    // ====================================================
    // AUTENTICAÇÃO
    // ====================================================

    if (!req.usuario) {

      return res.status(401).json({
        mensagem:
          'Usuário não autenticado.'
      });

    }


    // ====================================================
    // PERFIL
    // ====================================================

    if (
      req.usuario.perfil !==
      UserProfile.Logista
    ) {

      return res.status(403).json({
        mensagem:
          'Somente usuários com perfil logista podem criar uma loja.'
      });

    }


    // ====================================================
    // PROPRIETÁRIO
    // ====================================================

    const proprietarioId =
      String(req.usuario.id);


    // ====================================================
    // CRIAR
    // ====================================================

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

  } catch (error: any) {

    console.error(
      'Erro ao criar loja:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao criar loja.'

    });

  }

}


// ======================================================
// LISTAR LOJAS
// ======================================================

export async function listarLojas(
  req: Request,
  res: Response
) {

  try {

    const lojas =
      await lojaService.listarLojas();


    return res.status(200).json(
      lojas
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar lojas:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao buscar lojas.'

    });

  }

}


// ======================================================
// BUSCAR LOJA POR ID
// ======================================================

export async function buscarLojaPorId(
  req: Request,
  res: Response
) {

  try {

    const id =
      String(req.params.id);


    const loja =
      await lojaService.buscarLojaPorId(
        id
      );


    return res.status(200).json(
      loja
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar loja:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao buscar loja.'

    });

  }

}


// ======================================================
// BUSCAR MINHA LOJA
// ======================================================

export async function buscarMinhaLoja(
  req: AuthRequest,
  res: Response
) {

  try {

    // ====================================================
    // AUTENTICAÇÃO
    // ====================================================

    if (!req.usuario) {

      return res.status(401).json({
        mensagem:
          'Usuário não autenticado.'
      });

    }


    // ====================================================
    // PERFIL
    // ====================================================

    if (
      req.usuario.perfil !==
      UserProfile.Logista
    ) {

      return res.status(403).json({

        mensagem:
          'Somente lojistas podem acessar esta rota.'

      });

    }


    // ====================================================
    // BUSCAR PELO TOKEN
    // ====================================================

    const loja =
      await lojaService
        .buscarLojaDoProprietario(
          String(req.usuario.id)
        );


    return res.status(200).json(
      loja
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar minha loja:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao buscar loja.'

    });

  }

}


// ======================================================
// ATUALIZAR LOJA
// ======================================================

export async function atualizarLoja(
  req: AuthRequest,
  res: Response
) {

  try {

    // ====================================================
    // AUTENTICAÇÃO
    // ====================================================

    if (!req.usuario) {

      return res.status(401).json({
        mensagem:
          'Usuário não autenticado.'
      });

    }


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
      req.usuario.perfil ===
      UserProfile.ADMIN;


    const ehProprietario =
      loja.proprietarioId.toString() ===
      String(req.usuario.id);


    if (
      !ehAdmin &&
      !ehProprietario
    ) {

      return res.status(403).json({

        mensagem:
          'Você só pode alterar sua própria loja.'

      });

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

  } catch (error: any) {

    console.error(
      'Erro ao atualizar loja:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao atualizar loja.'

    });

  }

}


// ======================================================
// ATUALIZAR HORÁRIOS
// ======================================================

export async function atualizarHorarios(
  req: AuthRequest,
  res: Response
) {

  try {

    // ====================================================
    // AUTENTICAÇÃO
    // ====================================================

    if (!req.usuario) {

      return res.status(401).json({
        mensagem:
          'Usuário não autenticado.'
      });

    }


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
      req.usuario.perfil ===
      UserProfile.ADMIN;


    const ehProprietario =
      loja.proprietarioId.toString() ===
      String(req.usuario.id);


    if (
      !ehAdmin &&
      !ehProprietario
    ) {

      return res.status(403).json({

        mensagem:
          'Você só pode alterar os horários da sua própria loja.'

      });

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

  } catch (error: any) {

    console.error(
      'Erro ao atualizar horários:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao atualizar horários.'

    });

  }

}


// ======================================================
// ATUALIZAR STATUS
// ======================================================

export async function atualizarStatusLoja(
  req: AuthRequest,
  res: Response
) {

  try {

    // ====================================================
    // AUTENTICAÇÃO
    // ====================================================

    if (!req.usuario) {

      return res.status(401).json({
        mensagem:
          'Usuário não autenticado.'
      });

    }


    // ====================================================
    // SOMENTE ADMIN
    // ====================================================

    if (
      req.usuario.perfil !==
      UserProfile.ADMIN
    ) {

      return res.status(403).json({

        mensagem:
          'Somente administradores podem alterar o status da loja.'

      });

    }


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

  } catch (error: any) {

    console.error(
      'Erro ao atualizar status:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao atualizar status.'

    });

  }

}


// ======================================================
// VERIFICAR SE A LOJA ESTÁ ABERTA
// ======================================================

export async function verificarLojaAberta(
  req: Request,
  res: Response
) {

  try {

    const id =
      String(req.params.id);


    const resultado =
      await lojaService
        .verificarLojaAberta(id);


    return res.status(200).json(
      resultado
    );

  } catch (error: any) {

    console.error(
      'Erro ao verificar funcionamento:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao verificar funcionamento da loja.'

    });

  }

}


// ======================================================
// EXCLUIR LOJA
// ======================================================

export async function excluirLoja(
  req: AuthRequest,
  res: Response
) {

  try {

    // ====================================================
    // AUTENTICAÇÃO
    // ====================================================

    if (!req.usuario) {

      return res.status(401).json({
        mensagem:
          'Usuário não autenticado.'
      });

    }


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
      req.usuario.perfil ===
      UserProfile.ADMIN;


    const ehProprietario =
      loja.proprietarioId.toString() ===
      String(req.usuario.id);


    if (
      !ehAdmin &&
      !ehProprietario
    ) {

      return res.status(403).json({

        mensagem:
          'Você só pode excluir sua própria loja.'

      });

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

  } catch (error: any) {

    console.error(
      'Erro ao excluir loja:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      mensagem:
        error.message ||
        'Erro interno ao excluir loja.'

    });

  }

}

