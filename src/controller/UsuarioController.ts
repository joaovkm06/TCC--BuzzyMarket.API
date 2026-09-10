
import { Request, Response } from 'express';

import * as userService from '../service/UserService';
import { UserProfile } from '../model/usuario';


// ======================================================
// POST /users
// CADASTRO PÚBLICO DE CLIENTE
// ======================================================

export async function criarUsuario(
  req: Request,
  res: Response
) {
  try {

    // IMPORTANTE:
    // A rota pública SEMPRE cria cliente.
    // Mesmo que alguém envie perfil: "admin",
    // o servidor vai ignorar e usar cliente.

    const usuario = await userService.criarUsuario({
      ...req.body,
      perfil: UserProfile.Cliente
    });

    return res.status(201).json({
      mensagem: 'Cliente criado com sucesso.',
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
// POST /users/lojista
// CADASTRO PÚBLICO DE LOJISTA
// ======================================================

export async function criarLogista(
  req: Request,
  res: Response
) {
  try {

    // A rota força o perfil de lojista.

    const usuario = await userService.criarUsuario({
      ...req.body,
      perfil: UserProfile.Logista
    });

    return res.status(201).json({
      mensagem: 'Lojista criado com sucesso.',
      usuario
    });

  } catch (error: any) {

    console.error(
      'Erro ao criar lojista:',
      error
    );

    return res.status(
      error.status || 400
    ).json({
      mensagem:
        error.message ||
        'Não foi possível criar o lojista.'
    });
  }
}


// ======================================================
// POST /users/funcionario
// CRIAR FUNCIONÁRIO
// ======================================================

export async function criarFuncionario(
  req: Request,
  res: Response
) {
  try {

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

  } catch (error: any) {

    console.error(
      'Erro ao criar funcionário:',
      error
    );

    return res.status(
      error.status || 400
    ).json({
      mensagem:
        error.message ||
        'Não foi possível criar o funcionário.'
    });
  }
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
  try {

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

  } catch (error: any) {

    console.error(
      'Erro ao criar administrador:',
      error
    );

    return res.status(
      error.status || 400
    ).json({
      mensagem:
        error.message ||
        'Não foi possível criar o administrador.'
    });
  }
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
// BUSCAR USUÁRIO
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
// ATUALIZAR USUÁRIO
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
// EXCLUIR USUÁRIO
// SOMENTE ADMIN
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

// ======================================================
// PATCH /users/:id/funcionario
// CONTRATAR CLIENTE COMO FUNCIONÁRIO
// ======================================================

export async function contratarFuncionario(
  req: Request,
  res: Response
) {
  try {

    // O middleware autenticar colocou o usuário
    // logado dentro de req.usuario.

    const usuarioLogado = (req as any).usuario;

    if (!usuarioLogado) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.'
      });
    }


    // Se for ADMIN, pode informar lojaId.
    // Se for LOJISTA, o service ignora esse valor
    // e usa a loja vinculada ao próprio lojista.

    const lojaId =
      req.body?.lojaId;


    const funcionario =
      await userService.contratarClienteComoFuncionario(
        String(req.params.id),
        String(usuarioLogado.id),
        lojaId
      );


    return res.status(200).json({
      mensagem:
        'Cliente contratado como funcionário com sucesso.',
      usuario: funcionario
    });

  } catch (error: any) {

    console.error(
      'Erro ao contratar funcionário:',
      error
    );

    return res.status(
      error.status || 400
    ).json({
      mensagem:
        error.message ||
        'Não foi possível contratar o funcionário.'
    });
  }
}

