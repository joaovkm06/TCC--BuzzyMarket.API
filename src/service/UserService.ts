
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import {
  UserProfile
} from '../model/usuario';

import * as userRepository
  from '../repository/UserRepository';

import * as lojaRepository
  from '../repository/LojaRepository';

import { AppError } from '../error/AppError';

// ======================================================
// VALIDAR OBJECT ID
// ======================================================

function validarObjectId(
  id: string,
  nomeCampo: string
) {
  if (
    !id ||
    !Types.ObjectId.isValid(id)
  ) {
    throw new AppError(
      `${nomeCampo} inválido.`,
      400
    );
  }
}

// ======================================================
// VALIDAR ENDEREÇO
// ======================================================

function validarEndereco(
  endereco: any
) {
  if (endereco === undefined) {
    return;
  }

  if (
    !endereco ||
    typeof endereco !== 'object'
  ) {
    throw new AppError(
      'Endereço inválido.',
      400
    );
  }

  const camposObrigatorios = [
    'cep',
    'logradouro',
    'numero',
    'bairro',
    'cidade',
    'estado'
  ];

  for (
    const campo of camposObrigatorios
  ) {
    if (
      !endereco[campo] ||
      typeof endereco[campo] !== 'string' ||
      !endereco[campo].trim()
    ) {
      throw new AppError(
        `O campo ${campo} do endereço é obrigatório.`,
        400
      );
    }
  }
}

// ======================================================
// POST /users
// CRIAR USUÁRIO
// ======================================================

export async function criarUsuario(
  dados: any
) {
  const {
    nome,
    email,
    senha,
    perfil,
    endereco,
    lojaId
  } = dados;

  // ====================================================
  // CAMPOS OBRIGATÓRIOS
  // ====================================================

  if (
    !nome ||
    typeof nome !== 'string' ||
    !nome.trim()
  ) {
    throw new AppError(
      'Nome é obrigatório.',
      400
    );
  }

  if (
    !email ||
    typeof email !== 'string' ||
    !email.trim()
  ) {
    throw new AppError(
      'Email é obrigatório.',
      400
    );
  }

  if (
    !senha ||
    typeof senha !== 'string'
  ) {
    throw new AppError(
      'Senha é obrigatória.',
      400
    );
  }

  // ====================================================
  // VALIDAR SENHA
  // ====================================================

  if (senha.length < 6) {
    throw new AppError(
      'A senha deve possuir pelo menos 6 caracteres.',
      400
    );
  }

  // ====================================================
  // PERFIL
  // ====================================================

  const perfilFinal =
    perfil || UserProfile.Cliente;

  if (
    !Object.values(UserProfile)
      .includes(perfilFinal)
  ) {
    throw new AppError(
      'Perfil de usuário inválido.',
      400
    );
  }

  // ====================================================
  // REGRA DE SEGURANÇA
  // ====================================================

  if (
    perfilFinal !== UserProfile.Cliente
  ) {
    throw new AppError(
      'Novos usuários devem ser cadastrados como cliente.',
      400
    );
  }

  // ====================================================
  // CLIENTE NÃO POSSUI LOJA
  // ====================================================

  if (lojaId) {
    throw new AppError(
      'Cliente não pode possuir lojaId.',
      400
    );
  }

  // ====================================================
  // VALIDAR ENDEREÇO
  // ====================================================

  validarEndereco(endereco);

  // ====================================================
  // VERIFICAR EMAIL
  // ====================================================

  const usuarioExistente =
    await userRepository.buscarUsuarioPorEmail(
      email.toLowerCase().trim()
    );

  if (usuarioExistente) {
    throw new AppError(
      'Este email já está cadastrado.',
      409
    );
  }

  // ====================================================
  // CRIPTOGRAFAR SENHA
  // ====================================================

  const senhaHash =
    await bcrypt.hash(
      senha,
      10
    );

  // ====================================================
  // CRIAR USUÁRIO
  // ====================================================

  return await userRepository.criarUsuario({
    nome: nome.trim(),

    email:
      email.toLowerCase().trim(),

    senhaHash,

    perfil:
      UserProfile.Cliente,

    endereco
  });
}

// ======================================================
// GET /users
// LISTAR USUÁRIOS
// ======================================================

export async function listarUsuarios() {
  return await userRepository
    .listarUsuarios();
}

// ======================================================
// GET /users/:id
// BUSCAR USUÁRIO
// ======================================================

export async function buscarUsuarioPorId(
  id: string
) {
  validarObjectId(
    id,
    'ID do usuário'
  );

  const usuario =
    await userRepository
      .buscarUsuarioPorId(id);

  if (!usuario) {
    throw new AppError(
      'Usuário não encontrado.',
      404
    );
  }

  return usuario;
}

// ======================================================
// PUT /users/:id
// ATUALIZAR USUÁRIO
// ======================================================

export async function atualizarUsuario(
  id: string,
  dados: any
) {
  validarObjectId(
    id,
    'ID do usuário'
  );

  // ====================================================
  // BUSCAR USUÁRIO ATUAL
  // ====================================================

  const usuarioAtual =
    await userRepository
      .buscarUsuarioSemPopulate(id);

  if (!usuarioAtual) {
    throw new AppError(
      'Usuário não encontrado.',
      404
    );
  }

  const {
    nome,
    email,
    senha,
    perfil,
    endereco,
    lojaId
  } = dados;

  // ====================================================
  // VALIDAR NOME
  // ====================================================

  if (
    nome !== undefined &&
    (
      typeof nome !== 'string' ||
      !nome.trim()
    )
  ) {
    throw new AppError(
      'Nome inválido.',
      400
    );
  }

  // ====================================================
  // VALIDAR EMAIL
  // ====================================================

  if (email !== undefined) {
    if (
      typeof email !== 'string' ||
      !email.trim()
    ) {
      throw new AppError(
        'Email inválido.',
        400
      );
    }

    const emailNormalizado =
      email.toLowerCase().trim();

    const usuarioComEmail =
      await userRepository
        .buscarUsuarioPorEmail(
          emailNormalizado
        );

    if (
      usuarioComEmail &&
      usuarioComEmail._id.toString() !==
        usuarioAtual._id.toString()
    ) {
      throw new AppError(
        'Este email já está cadastrado.',
        409
      );
    }
  }

  // ====================================================
  // VALIDAR ENDEREÇO
  // ====================================================

  validarEndereco(
    endereco
  );

  // ====================================================
  // DEFINIR PERFIL
  // ====================================================

  const perfilAtualizado =
    perfil ||
    usuarioAtual.perfil;

  if (
    !Object.values(UserProfile)
      .includes(perfilAtualizado)
  ) {
    throw new AppError(
      'Perfil de usuário inválido.',
      400
    );
  }

  // ====================================================
  // LOJA
  // ====================================================

  let lojaParaSalvar:
    Types.ObjectId |
    undefined;

  // ====================================================
  // CLIENTE
  // ====================================================

  if (
    perfilAtualizado ===
    UserProfile.Cliente
  ) {
    if (lojaId) {
      throw new AppError(
        'Cliente não pode possuir lojaId.',
        400
      );
    }

    lojaParaSalvar =
      undefined;
  }

  // ====================================================
  // ADMIN
  // ====================================================

  else if (
    perfilAtualizado ===
    UserProfile.ADMIN
  ) {
    if (lojaId) {
      throw new AppError(
        'Administrador não pode possuir lojaId.',
        400
      );
    }

    lojaParaSalvar =
      undefined;
  }

  // ====================================================
  // FUNCIONÁRIO
  // ====================================================

  else if (
    perfilAtualizado ===
    UserProfile.Funcionario
  ) {
    const lojaFinal =
      lojaId ||
      usuarioAtual.lojaId;

    if (!lojaFinal) {
      throw new AppError(
        'Funcionário precisa estar vinculado a uma loja.',
        400
      );
    }

    validarObjectId(
      lojaFinal.toString(),
      'lojaId'
    );

    const loja =
      await lojaRepository
        .buscarLojaPorIdSemPopulate(
          lojaFinal.toString()
        );

    if (!loja) {
      throw new AppError(
        'Loja não encontrada.',
        404
      );
    }

    lojaParaSalvar =
      new Types.ObjectId(
        lojaFinal.toString()
      );
  }

  // ====================================================
  // LOJISTA
  // ====================================================

  else if (
    perfilAtualizado ===
    UserProfile.Logista
  ) {
    /*
     * O lojista pode existir sem loja.
     */

    if (lojaId) {
      validarObjectId(
        lojaId.toString(),
        'lojaId'
      );

      const loja =
        await lojaRepository
          .buscarLojaPorIdSemPopulate(
            lojaId.toString()
          );

      if (!loja) {
        throw new AppError(
          'Loja não encontrada.',
          404
        );
      }

      if (
        loja.proprietarioId &&
        loja.proprietarioId.toString() !==
          usuarioAtual._id.toString()
      ) {
        throw new AppError(
          'Esta loja já pertence a outro proprietário.',
          403
        );
      }

      lojaParaSalvar =
        new Types.ObjectId(
          lojaId.toString()
        );
    }

    else if (
      usuarioAtual.lojaId
    ) {
      lojaParaSalvar =
        usuarioAtual.lojaId;
    }
  }

  // ====================================================
  // PREPARAR DADOS
  // ====================================================

  const dadosAtualizacao: any = {};

  if (nome !== undefined) {
    dadosAtualizacao.nome =
      nome.trim();
  }

  if (email !== undefined) {
    dadosAtualizacao.email =
      email.toLowerCase().trim();
  }

  if (endereco !== undefined) {
    dadosAtualizacao.endereco =
      endereco;
  }

  if (perfil !== undefined) {
    dadosAtualizacao.perfil =
      perfilAtualizado;
  }

  if (
    perfilAtualizado ===
      UserProfile.Funcionario ||
    perfilAtualizado ===
      UserProfile.Logista
  ) {
    if (lojaParaSalvar) {
      dadosAtualizacao.lojaId =
        lojaParaSalvar;
    }
  }

  else {
    dadosAtualizacao.$unset = {
      lojaId: 1
    };
  }

  // ====================================================
  // SENHA
  // ====================================================

  if (senha !== undefined) {
    if (
      typeof senha !== 'string' ||
      senha.length < 6
    ) {
      throw new AppError(
        'A senha deve possuir pelo menos 6 caracteres.',
        400
      );
    }

    dadosAtualizacao.senhaHash =
      await bcrypt.hash(
        senha,
        10
      );
  }

  // ====================================================
  // ATUALIZAR
  // ====================================================

  return await userRepository
    .atualizarUsuario(
      id,
      dadosAtualizacao
    );
}

// ======================================================
// DELETE /users/:id
// EXCLUIR USUÁRIO
// ======================================================

export async function excluirUsuario(
  id: string
) {
  validarObjectId(
    id,
    'ID do usuário'
  );

  // ====================================================
  // BUSCAR USUÁRIO
  // ====================================================

  const usuario =
    await userRepository
      .buscarUsuarioSemPopulate(id);

  if (!usuario) {
    throw new AppError(
      'Usuário não encontrado.',
      404
    );
  }

  // ====================================================
  // VERIFICAR SE POSSUI LOJA
  // ====================================================

  const loja =
    await lojaRepository
      .buscarLojaDoProprietario(id);

  if (loja) {
    throw new AppError(
      'Não é possível excluir um usuário que possui uma loja.',
      400
    );
  }

  // ====================================================
  // EXCLUIR
  // ====================================================

  return await userRepository
    .excluirUsuario(id);
}

// ======================================================
// PATCH /users/:id/funcionario
// CONTRATAR CLIENTE COMO FUNCIONÁRIO
// ======================================================

export async function contratarClienteComoFuncionario(
  clienteId: string,
  solicitanteId: string,
  lojaIdInformada?: string
) {
  validarObjectId(
    clienteId,
    'clienteId'
  );

  validarObjectId(
    solicitanteId,
    'solicitanteId'
  );

  // ====================================================
  // BUSCAR SOLICITANTE
  // ====================================================

  const solicitante =
    await userRepository
      .buscarUsuarioSemPopulate(
        solicitanteId
      );

  if (!solicitante) {
    throw new AppError(
      'Usuário que está realizando a contratação não foi encontrado.',
      404
    );
  }

  // ====================================================
  // BUSCAR CLIENTE
  // ====================================================

  const cliente =
    await userRepository
      .buscarUsuarioSemPopulate(
        clienteId
      );

  if (!cliente) {
    throw new AppError(
      'Cliente não encontrado.',
      404
    );
  }

  // ====================================================
  // SOMENTE CLIENTE PODE SER CONTRATADO
  // ====================================================

  if (
    cliente.perfil !==
    UserProfile.Cliente
  ) {
    throw new AppError(
      'Somente usuários com perfil cliente podem ser contratados como funcionário.',
      400
    );
  }

  // ====================================================
  // DEFINIR LOJA
  // ====================================================

  let lojaId: string;

  // ====================================================
  // LOJISTA
  // ====================================================

  if (
    solicitante.perfil ===
    UserProfile.Logista
  ) {
    if (
      !solicitante.lojaId
    ) {
      throw new AppError(
        'O lojista não possui uma loja vinculada.',
        400
      );
    }

    lojaId =
      solicitante.lojaId.toString();
  }

  // ====================================================
  // ADMIN
  // ====================================================

  else if (
    solicitante.perfil ===
    UserProfile.ADMIN
  ) {
    if (!lojaIdInformada) {
      throw new AppError(
        'O administrador precisa informar o lojaId.',
        400
      );
    }

    validarObjectId(
      lojaIdInformada,
      'lojaId'
    );

    lojaId =
      lojaIdInformada;
  }

  // ====================================================
  // OUTROS PERFIS
  // ====================================================

  else {
    throw new AppError(
      'Você não possui permissão para contratar funcionários.',
      403
    );
  }

  // ====================================================
  // BUSCAR LOJA
  // ====================================================

  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        lojaId
      );

  if (!loja) {
    throw new AppError(
      'Loja não encontrada.',
      404
    );
  }

  // ====================================================
  // LOJISTA SÓ PODE CONTRATAR NA PRÓPRIA LOJA
  // ====================================================

  if (
    solicitante.perfil ===
    UserProfile.Logista
  ) {
    const proprietarioId =
      loja.proprietarioId?.toString();

    if (
      proprietarioId !==
      solicitante._id.toString()
    ) {
      throw new AppError(
        'Você só pode contratar funcionários para sua própria loja.',
        403
      );
    }
  }

  // ====================================================
  // TRANSFORMAR CLIENTE EM FUNCIONÁRIO
  // ====================================================

  return await userRepository
    .atualizarUsuario(
      clienteId,
      {
        perfil:
          UserProfile.Funcionario,

        lojaId:
          loja._id
      }
    );
}

// ======================================================
// GET /users/funcionarios/:lojaId
// LISTAR FUNCIONÁRIOS DA LOJA
// ======================================================

export async function listarFuncionariosDaLoja(
  lojaId: string
) {
  validarObjectId(
    lojaId,
    'lojaId'
  );

  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        lojaId
      );

  if (!loja) {
    throw new AppError(
      'Loja não encontrada.',
      404
    );
  }

  return await userRepository
    .listarFuncionariosDaLoja(
      lojaId
    );
}

