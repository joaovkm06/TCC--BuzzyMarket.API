
import { Types } from 'mongoose';

import {
  UserModel,
  UserProfile
} from '../model/usuario';

// ======================================================
// CRIAR USUÁRIO
// ======================================================

export async function criarUsuario(
  dados: any
) {
  return await UserModel.create(
    dados
  );
}

// ======================================================
// LISTAR USUÁRIOS
// ======================================================

export async function listarUsuarios() {
  return await UserModel
    .find()
    .select('-senhaHash')
    .populate(
      'lojaId',
      'nome categoria status'
    )
    .sort({
      nome: 1
    });
}

// ======================================================
// BUSCAR USUÁRIO POR ID
// ======================================================

export async function buscarUsuarioPorId(
  id: string
) {
  return await UserModel
    .findById(id)
    .select('-senhaHash')
    .populate(
      'lojaId',
      'nome categoria status'
    );
}

// ======================================================
// BUSCAR USUÁRIO SEM POPULATE
// ======================================================

export async function buscarUsuarioSemPopulate(
  id: string
) {
  return await UserModel
    .findById(id);
}

// ======================================================
// BUSCAR USUÁRIO POR EMAIL
// ======================================================

export async function buscarUsuarioPorEmail(
  email: string
) {
  return await UserModel
    .findOne({
      email: email
        .toLowerCase()
        .trim()
    });
}

// ======================================================
// ATUALIZAR USUÁRIO
// ======================================================

export async function atualizarUsuario(
  id: string,
  dados: any
) {
  return await UserModel
    .findByIdAndUpdate(
      id,
      dados,
      {
        new: true,
        runValidators: true
      }
    )
    .select('-senhaHash')
    .populate(
      'lojaId',
      'nome categoria status'
    );
}

// ======================================================
// EXCLUIR USUÁRIO
// ======================================================

export async function excluirUsuario(
  id: string
) {
  return await UserModel
    .findByIdAndDelete(id);
}

// ======================================================
// REMOVER LOJA DO USUÁRIO
// ======================================================

export async function removerLojaDoUsuario(
  usuarioId: string
) {

  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw new Error(
      'usuarioId inválido.'
    );

  }

  return await UserModel
    .findByIdAndUpdate(
      usuarioId,
      {
        $unset: {
          lojaId: 1
        }
      },
      {
        new: true,
        runValidators: true
      }
    );
}

// ======================================================
// REMOVER LOJA DOS FUNCIONÁRIOS
// ======================================================

export async function removerLojaDosFuncionarios(
  lojaId: string
) {

  if (
    !Types.ObjectId.isValid(lojaId)
  ) {

    throw new Error(
      'lojaId inválido.'
    );

  }

  const lojaObjectId =
    new Types.ObjectId(lojaId);

  return await UserModel
    .updateMany(
      {
        lojaId: lojaObjectId,
        perfil: UserProfile.Funcionario
      },
      {
        $unset: {
          lojaId: 1
        }
      }
    );
}

// ======================================================
// LISTAR FUNCIONÁRIOS DA LOJA
// ======================================================

export async function listarFuncionariosDaLoja(
  lojaId: string
) {

  if (
    !Types.ObjectId.isValid(lojaId)
  ) {

    throw new Error(
      'lojaId inválido.'
    );

  }

  const lojaObjectId =
    new Types.ObjectId(lojaId);

  return await UserModel
    .find({
      lojaId: lojaObjectId,
      perfil: UserProfile.Funcionario
    })
    .select('-senhaHash')
    .sort({
      nome: 1
    });
}



