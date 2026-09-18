
import { Request, Response } from 'express';

import * as userService from '../service/UserService';

import { UserProfile } from '../model/usuario';

import { AuthRequest } from '../types/AuthRequest';

import { AppError } from '../error/AppError';

// ======================================================
// POST /users
// CADASTRO PÚBLICO DE CLIENTE
// ======================================================

export async function criarUsuario(
  req: Request,
  res: Response
) {

  // A rota pública SEMPRE cria cliente.
  // Mesmo que alguém envie perfil: "admin",
  // o servidor vai ignorar e usar cliente.

  const usuario =
    await userService.criarUsuario({
      ...req.body,
      perfil: UserProfile.Cliente
    });

  return res.status(201).json({
    mensagem: 'Cliente criado com sucesso.',
    usuario
  });
}

// ======================================================
// POST /users/lojista
// CADASTRO PÚBLICO DE LOJISTA
// ======================================================

export async function criarLogista(
  req: Request,
  res: Response
) {

  // A rota força o perfil de lojista.

  const usuario =
    await userService.criarUsuario({
      ...req.body,
      perfil: UserProfile.Logista
    });

  return res.status(201).json({
    mensagem: 'Lojista criado com sucesso.',
    usuario
  });
}

// ======================================================
// POST /users/funcionario
// CRIAR FUNCIONÁRIO
// ======================================================

export async function criarFuncionario(
  req: Request,
  res: Response
) {

  // A rota força o perfil de funcionário.

  const funcionario =
    await userService.criarUsuario({
      ...req.body,
      perfil: UserProfile.Funcionario
    });

  return res.status(201).json({
    mensagem: 'Funcionário criado com sucesso.',
    usuario: funcionario
  });
}

// ======================================================
// POST /users/admin
// CRIAR ADMINISTRADOR
// SOMENTE ADMIN
// ======================================================

export async function criarAdmin(
  req: Request,
  res: Response
) {

  // A rota força o perfil de administrador.

  const admin =
    await userService.criarUsuario({
      ...req.body,
      perfil: UserProfile.ADMIN
    });

  return res.status(201).json({
    mensagem: 'Administrador criado com sucesso.',
    usuario: admin
  });
}

// ======================================================
// GET /users
// LISTAR USUÁRIOS
// SOMENTE ADMIN
// ======================================================

export async function listarUsuarios(
  req: Request,
  res: Response
) {

  const usuarios =
    await userService.listarUsuarios();

  return res.status(200).json(
    usuarios
  );
}

// ======================================================
// GET /users/:id
// BUSCAR USUÁRIO
// ======================================================

export async function buscarUsuario(
  req: Request,
  res: Response
) {

  const usuario =
    await userService.buscarUsuarioPorId(
      String(req.params.id)
    );

  if (!usuario) {
    throw new AppError(
      'Usuário não encontrado.',
      404
    );
  }

  return res.status(200).json(
    usuario
  );
}

// ======================================================
// PUT /users/:id
// ATUALIZAR USUÁRIO
// ======================================================

export async function atualizarUsuario(
  req: AuthRequest,
  res: Response
) {

  // ====================================================
  // USUÁRIO AUTENTICADO
  // ====================================================

  if (!req.usuario) {
    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }

  const usuarioId =
    String(req.params.id);

  const ehAdmin =
    req.usuario.perfil === UserProfile.ADMIN;

  const ehProprioUsuario =
    String(req.usuario.id) === usuarioId;

  // ====================================================
  // SEGURANÇA
  // ====================================================

  if (!ehAdmin && !ehProprioUsuario) {
    throw new AppError(
      'Você só pode atualizar seu próprio usuário.',
      403
    );
  }

  // ====================================================
  // COPIA OS DADOS RECEBIDOS
  // ====================================================

  const dadosAtualizacao = {
    ...req.body
  };

  // ====================================================
  // NÃO-ADMIN NÃO PODE ALTERAR PERFIL
  // NEM LOJA
  // ====================================================

  if (!ehAdmin) {

    if (
      Object.prototype.hasOwnProperty.call(
        dadosAtualizacao,
        'perfil'
      )
    ) {
      throw new AppError(
        'Você não pode alterar o perfil do usuário.',
        403
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        dadosAtualizacao,
        'lojaId'
      )
    ) {
      throw new AppError(
        'Você não pode alterar a loja vinculada ao usuário.',
        403
      );
    }
  }

  // ====================================================
  // ATUALIZA
  // ====================================================

  const usuario =
    await userService.atualizarUsuario(
      usuarioId,
      dadosAtualizacao
    );

  if (!usuario) {
    throw new AppError(
      'Usuário não encontrado.',
      404
    );
  }

  return res.status(200).json({
    mensagem:
      'Usuário atualizado com sucesso.',
    usuario
  });
}

// ======================================================
// GET /users/funcionarios
// LISTAR FUNCIONÁRIOS DA PRÓPRIA LOJA
// LOJISTA OU ADMIN
// ======================================================

export async function listarFuncionariosDaLoja(
  req: AuthRequest,
  res: Response
) {

  // ====================================================
  // USUÁRIO AUTENTICADO
  // ====================================================

  if (!req.usuario) {
    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }

  let lojaId: string | undefined;

  // ====================================================
  // LOJISTA
  // ====================================================

  if (
    req.usuario.perfil === UserProfile.Logista
  ) {

    if (!req.usuario.lojaId) {
      throw new AppError(
        'O lojista não possui uma loja vinculada.',
        400
      );
    }

    // O lojista SEMPRE consulta a própria loja.
    lojaId =
      String(req.usuario.lojaId);
  }

  // ====================================================
  // ADMIN
  // ====================================================

  else if (
    req.usuario.perfil === UserProfile.ADMIN
  ) {

    // Admin pode informar a loja pela query string.
    lojaId =
      req.query.lojaId
        ? String(req.query.lojaId)
        : undefined;

    if (!lojaId) {
      throw new AppError(
        'O administrador precisa informar o lojaId.',
        400
      );
    }
  }

  // ====================================================
  // OUTROS PERFIS
  // ====================================================

  else {
    throw new AppError(
      'Você não possui permissão para listar funcionários.',
      403
    );
  }

  // ====================================================
  // BUSCAR FUNCIONÁRIOS
  // ====================================================

  const funcionarios =
    await userService.listarFuncionariosDaLoja(
      lojaId
    );

  return res.status(200).json({
    lojaId,
    quantidade: funcionarios.length,
    funcionarios
  });
}

// ======================================================
// DELETE /users/:id
// EXCLUIR USUÁRIO
// SOMENTE ADMIN
// ======================================================

export async function excluirUsuario(
  req: Request,
  res: Response
) {

  const usuario =
    await userService.excluirUsuario(
      String(req.params.id)
    );

  if (!usuario) {
    throw new AppError(
      'Usuário não encontrado.',
      404
    );
  }

  return res.status(200).json({
    mensagem:
      'Usuário excluído com sucesso.'
  });
}

// ======================================================
// PATCH /users/:id/funcionario
// CONTRATAR CLIENTE COMO FUNCIONÁRIO
// ======================================================

export async function contratarFuncionario(
  req: AuthRequest,
  res: Response
) {

  // ====================================================
  // USUÁRIO AUTENTICADO
  // ====================================================

  if (!req.usuario) {
    throw new AppError(
      'Usuário não autenticado.',
      401
    );
  }

  // ====================================================
  // LOJA
  // ====================================================

  // Se for ADMIN, pode informar lojaId.
  // Se for LOJISTA, o Service ignora esse valor
  // e usa a loja vinculada ao próprio lojista.

  const lojaId =
    req.body?.lojaId;

  // ====================================================
  // CONTRATAR
  // ====================================================

  const funcionario =
    await userService.contratarClienteComoFuncionario(
      String(req.params.id),
      String(req.usuario.id),
      lojaId
    );

  return res.status(200).json({
    mensagem:
      'Cliente contratado como funcionário com sucesso.',
    usuario: funcionario
  });
}

