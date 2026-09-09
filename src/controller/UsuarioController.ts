import { Request, Response } from 'express';

import * as userService from '../service/UserService';


// ======================================================
// POST /users
// ======================================================

export async function criarUsuario(
  req: Request,
  res: Response
) {
  try {

    const usuario =
      await userService.criarUsuario(req.body);

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso.',
      usuario
    });

  } catch (error: any) {

    console.error(
      'Erro ao criar usuário:',
      error
    );

    return res.status(
      error.status || 400
    ).json({
      mensagem:
        error.message ||
        'Não foi possível criar o usuário.',

      ...(error.perfisPermitidos && {
        perfisPermitidos:
          error.perfisPermitidos
      })
    });
  }
}


// ======================================================
// GET /users
// ======================================================

export async function listarUsuarios(
  req: Request,
  res: Response
) {
  try {

    const usuarios =
      await userService.listarUsuarios();

    return res.status(200).json(
      usuarios
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar usuários:',
      error
    );

    return res.status(500).json({
      mensagem:
        'Não foi possível buscar os usuários.',
      erro: error.message
    });
  }
}


// ======================================================
// GET /users/:id
// ======================================================

export async function buscarUsuario(
  req: Request,
  res: Response
) {
  try {

    const usuario =
      await userService.buscarUsuarioPorId(
        String(req.params.id)
      );

    if (!usuario) {
      return res.status(404).json({
        mensagem:
          'Usuário não encontrado.'
      });
    }

    return res.status(200).json(
      usuario
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar usuário:',
      error
    );

    return res.status(400).json({
      mensagem:
        'ID de usuário inválido.',
      erro: error.message
    });
  }
}


// ======================================================
// PUT /users/:id
// ======================================================

export async function atualizarUsuario(
  req: Request,
  res: Response
) {
  try {

    const usuario =
      await userService.atualizarUsuario(
        String(req.params.id),
        req.body
      );

    if (!usuario) {
      return res.status(404).json({
        mensagem:
          'Usuário não encontrado.'
      });
    }

    return res.status(200).json({
      mensagem:
        'Usuário atualizado com sucesso.',
      usuario
    });

  } catch (error: any) {

    console.error(
      'Erro ao atualizar usuário:',
      error
    );

    return res.status(
      error.status || 400
    ).json({
      mensagem:
        error.message ||
        'Não foi possível atualizar o usuário.',

      ...(error.perfisPermitidos && {
        perfisPermitidos:
          error.perfisPermitidos
      }),

      ...(error.motivo && {
        motivo: error.motivo
      }),

      ...(error.lojaId && {
        lojaId: error.lojaId
      })
    });
  }
}


// ======================================================
// DELETE /users/:id
// ======================================================

export async function excluirUsuario(
  req: Request,
  res: Response
) {
  try {

    const usuario =
      await userService.excluirUsuario(
      String(req.params.id)
      );

    if (!usuario) {
      return res.status(404).json({
        mensagem:
          'Usuário não encontrado.'
      });
    }

    return res.status(200).json({
      mensagem:
        'Usuário excluído com sucesso.'
    });

  } catch (error: any) {

    console.error(
      'Erro ao excluir usuário:',
      error
    );

    return res.status(
      error.status || 400
    ).json({
      mensagem:
        error.message ||
        'Não foi possível excluir o usuário.',

      ...(error.motivo && {
        motivo: error.motivo
      }),

      ...(error.lojaId && {
        lojaId: error.lojaId
      })
    });
  }
}