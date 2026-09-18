
import { Types } from 'mongoose';

import {
  UserProfile
} from '../model/usuario';

import {
  StatusLoja
} from '../model/loja';

import * as lojaRepository
  from '../repository/LojaRepository';

import * as userRepository
  from '../repository/UserRepository';

import { AppError } from '../error/AppError';

// ======================================================
// CRIAR LOJA
// ======================================================

export async function criarLoja(
  dados: any,
  proprietarioId: string
) {

  // ====================================================
  // VALIDAR ID
  // ====================================================

  if (
    !Types.ObjectId.isValid(
      proprietarioId
    )
  ) {

    throw new AppError(
      'ID do proprietário inválido.',
      400
    );

  }

  const {
    nome,
    descricao,
    categoria,
    foto,
    banner,
    telefone,
    endereco,
    horarios
  } = dados;

  // ====================================================
  // VALIDAÇÕES BÁSICAS
  // ====================================================

  if (
    !nome ||
    !categoria ||
    !telefone ||
    !endereco
  ) {

    throw new AppError(
      'Nome, categoria, telefone e endereco são obrigatórios.',
      400
    );

  }

  // ====================================================
  // VALIDAÇÃO DO ENDEREÇO
  // ====================================================

  if (
    !endereco.cep ||
    !endereco.logradouro ||
    !endereco.numero ||
    !endereco.bairro ||
    !endereco.cidade ||
    !endereco.estado
  ) {

    throw new AppError(
      'CEP, logradouro, número, bairro, cidade e estado são obrigatórios no endereço.',
      400
    );

  }

  // ====================================================
  // VERIFICA PROPRIETÁRIO
  // ====================================================

  const proprietario =
    await userRepository
      .buscarUsuarioSemPopulate(
        proprietarioId
      );

  if (!proprietario) {

    throw new AppError(
      'Proprietário não encontrado.',
      404
    );

  }

  // ====================================================
  // SOMENTE LOGISTA
  // ====================================================

  if (
    proprietario.perfil !==
    UserProfile.Logista
  ) {

    throw new AppError(
      'Somente usuários com perfil logista podem ser proprietários de uma loja.',
      403
    );

  }

  // ====================================================
  // VERIFICA SE JÁ POSSUI LOJA
  // ====================================================

  const lojaExistente =
    await lojaRepository
      .buscarLojaDoProprietario(
        proprietarioId
      );

  if (lojaExistente) {

    throw new AppError(
      'Este usuário já possui uma loja.',
      400
    );

  }

  // ====================================================
  // VERIFICA VÍNCULO NO USUÁRIO
  // ====================================================

  if (proprietario.lojaId) {

    throw new AppError(
      'Este usuário já possui uma loja vinculada.',
      400
    );

  }

  // ====================================================
  // CRIA LOJA
  // ====================================================

  const loja =
    await lojaRepository.criarLoja({

      nome:
        nome.trim(),

      descricao:
        descricao?.trim(),

      categoria:
        categoria.trim(),

      foto:
        foto?.trim(),

      banner:
        banner?.trim(),

      telefone:
        telefone.trim(),

      endereco,

      proprietarioId:
        new Types.ObjectId(
          proprietarioId
        ),

      status:
        'pendente',

      horarios:
        horarios || {}

    });

  // ====================================================
  // VINCULA LOJA AO USUÁRIO
  // ====================================================

  await userRepository
    .atualizarUsuario(

      proprietarioId,

      {
        lojaId: loja._id
      }

    );

  return loja;
}

// ======================================================
// LISTAR LOJAS
// ======================================================

export async function listarLojas() {

  return await lojaRepository
    .listarLojas();

}

// ======================================================
// BUSCAR LOJA POR ID
// ======================================================

export async function buscarLojaPorId(
  id: string
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw new AppError(
      'ID da loja inválido.',
      400
    );

  }

  const loja =
    await lojaRepository
      .buscarLojaPorId(id);

  if (!loja) {

    throw new AppError(
      'Loja não encontrada.',
      404
    );

  }

  return loja;
}

// ======================================================
// BUSCAR LOJA DO PROPRIETÁRIO
// ======================================================

export async function buscarLojaDoProprietario(
  proprietarioId: string
) {

  if (
    !Types.ObjectId.isValid(
      proprietarioId
    )
  ) {

    throw new AppError(
      'ID do proprietário inválido.',
      400
    );

  }

  const loja =
    await lojaRepository
      .buscarLojaDoProprietario(
        proprietarioId
      );

  if (!loja) {

    throw new AppError(
      'O usuário não possui uma loja.',
      404
    );

  }

  return loja;
}

// ======================================================
// ATUALIZAR LOJA
// ======================================================

export async function atualizarLoja(
  id: string,
  dados: any
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw new AppError(
      'ID da loja inválido.',
      400
    );

  }

  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );

  if (!loja) {

    throw new AppError(
      'Loja não encontrada.',
      404
    );

  }

  const {
    nome,
    descricao,
    categoria,
    foto,
    banner,
    telefone,
    endereco
  } = dados;

  // ====================================================
  // NOME
  // ====================================================

  if (
    nome !== undefined
  ) {

    if (
      typeof nome !== 'string' ||
      !nome.trim()
    ) {

      throw new AppError(
        'O nome da loja não pode ser vazio.',
        400
      );

    }

    loja.nome =
      nome.trim();

  }

  // ====================================================
  // DESCRIÇÃO
  // ====================================================

  if (
    descricao !== undefined
  ) {

    if (
      descricao !== null &&
      typeof descricao !== 'string'
    ) {

      throw new AppError(
        'A descrição deve ser um texto.',
        400
      );

    }

    loja.descricao =
      descricao?.trim();

  }

  // ====================================================
  // CATEGORIA
  // ====================================================

  if (
    categoria !== undefined
  ) {

    if (
      typeof categoria !== 'string' ||
      !categoria.trim()
    ) {

      throw new AppError(
        'A categoria da loja não pode ser vazia.',
        400
      );

    }

    loja.categoria =
      categoria.trim();

  }

  // ====================================================
  // FOTO
  // ====================================================

  if (
    foto !== undefined
  ) {

    if (
      foto !== null &&
      typeof foto !== 'string'
    ) {

      throw new AppError(
        'A foto deve ser um texto.',
        400
      );

    }

    loja.foto =
      foto?.trim();

  }

  // ====================================================
  // BANNER
  // ====================================================

  if (
    banner !== undefined
  ) {

    if (
      banner !== null &&
      typeof banner !== 'string'
    ) {

      throw new AppError(
        'O banner deve ser um texto.',
        400
      );

    }

    loja.banner =
      banner?.trim();

  }

  // ====================================================
  // TELEFONE
  // ====================================================

  if (
    telefone !== undefined
  ) {

    if (
      typeof telefone !== 'string' ||
      !telefone.trim()
    ) {

      throw new AppError(
        'O telefone da loja não pode ser vazio.',
        400
      );

    }

    loja.telefone =
      telefone.trim();

  }

  // ====================================================
  // ENDEREÇO
  // ====================================================

  if (
    endereco !== undefined
  ) {

    if (
      !endereco ||
      !endereco.cep ||
      !endereco.logradouro ||
      !endereco.numero ||
      !endereco.bairro ||
      !endereco.cidade ||
      !endereco.estado
    ) {

      throw new AppError(
        'CEP, logradouro, número, bairro, cidade e estado são obrigatórios no endereço.',
        400
      );

    }

    loja.endereco =
      endereco;

  }

  // ====================================================
  // SALVAR
  // ====================================================

  await loja.save();

  return loja;
}

// ======================================================
// ATUALIZAR HORÁRIOS
// ======================================================

export async function atualizarHorarios(
  id: string,
  horarios: any
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw new AppError(
      'ID da loja inválido.',
      400
    );

  }

  if (
    !horarios ||
    typeof horarios !== 'object' ||
    Array.isArray(horarios)
  ) {

    throw new AppError(
      'Informe os horários da loja.',
      400
    );

  }

  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );

  if (!loja) {

    throw new AppError(
      'Loja não encontrada.',
      404
    );

  }

  loja.horarios =
    horarios;

  await loja.save();

  return loja;
}

// ======================================================
// ATUALIZAR STATUS
// ======================================================

export async function atualizarStatusLoja(
  id: string,
  status: StatusLoja
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw new AppError(
      'ID da loja inválido.',
      400
    );

  }

  const statusPermitidos:
    StatusLoja[] = [

      'pendente',

      'aprovada',

      'rejeitada',

      'bloqueada'

    ];

  if (
    !statusPermitidos.includes(
      status
    )
  ) {

    const error =
      new AppError(
        'Status inválido.',
        400
      );

    error.statusPermitidos =
      statusPermitidos;

    throw error;

  }

  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );

  if (!loja) {

    throw new AppError(
      'Loja não encontrada.',
      404
    );

  }

  loja.status =
    status;

  await loja.save();

  return loja;
}

// ======================================================
// VERIFICAR SE A LOJA ESTÁ ABERTA
// ======================================================

export async function verificarLojaAberta(
  id: string
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw new AppError(
      'ID da loja inválido.',
      400
    );

  }

  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );

  if (!loja) {

    throw new AppError(
      'Loja não encontrada.',
      404
    );

  }

  // ====================================================
  // LOJA NÃO APROVADA
  // ====================================================

  if (
    loja.status !== 'aprovada'
  ) {

    return {

      aberta: false,

      motivo:
        `Loja está ${loja.status}.`

    };

  }

  // ====================================================
  // DATA E HORA ATUAL
  // ====================================================

  const agora =
    new Date();

  const diaSemana =
    agora.getDay();

  const dias = [

    'domingo',

    'segunda',

    'terca',

    'quarta',

    'quinta',

    'sexta',

    'sabado'

  ];

  const diaAtual =
    dias[diaSemana];

  // ====================================================
  // HORÁRIO DO DIA
  // ====================================================

  const horario =
    loja.horarios?.[
      diaAtual as keyof typeof loja.horarios
    ];

  if (!horario) {

    return {

      aberta: false,

      dia: diaAtual,

      mensagem:
        'A loja está fechada hoje.'

    };

  }

  // ====================================================
  // HORA ATUAL
  // ====================================================

  const horaAtual =

    agora
      .getHours()
      .toString()
      .padStart(2, '0')

    + ':' +

    agora
      .getMinutes()
      .toString()
      .padStart(2, '0');

  // ====================================================
  // VERIFICA ABERTURA
  // ====================================================

  const aberta =

    horaAtual >=
      horario.abertura &&

    horaAtual <
      horario.fechamento;

  return {

    aberta,

    dia: diaAtual,

    horario,

    horaAtual

  };
}

// ======================================================
// EXCLUIR LOJA
// ======================================================

export async function excluirLoja(
  id: string
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw new AppError(
      'ID da loja inválido.',
      400
    );

  }

  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );

  if (!loja) {

    throw new AppError(
      'Loja não encontrada.',
      404
    );

  }

  // ====================================================
  // REMOVE LOJA DO PROPRIETÁRIO
  // ====================================================

  await userRepository
    .removerLojaDoUsuario(
      loja.proprietarioId.toString()
    );

  // ====================================================
  // REMOVE LOJA DOS FUNCIONÁRIOS
  // ====================================================

  await userRepository
    .removerLojaDosFuncionarios(
      id
    );

  // ====================================================
  // EXCLUI LOJA
  // ====================================================

  await lojaRepository
    .excluirLoja(id);

  return true;
}

