
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


// ======================================================
// ERRO PADRÃO
// ======================================================

function erro(
  mensagem: string,
  status = 400
) {

  const error: any =
    new Error(mensagem);

  error.status = status;

  return error;
}


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

    throw erro(
      'ID do proprietário inválido.'
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

    throw erro(
      'Nome, categoria, telefone e endereco são obrigatórios.'
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

    throw erro(
      'CEP, logradouro, número, bairro, cidade e estado são obrigatórios no endereço.'
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

    throw erro(
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

    throw erro(
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

    throw erro(
      'Este usuário já possui uma loja.'
    );

  }


  // ====================================================
  // VERIFICA VÍNCULO NO USUÁRIO
  // ====================================================

  if (proprietario.lojaId) {

    throw erro(
      'Este usuário já possui uma loja vinculada.'
    );

  }


  // ====================================================
  // CRIA LOJA
  // ====================================================

  const loja =
    await lojaRepository.criarLoja({

      nome: nome.trim(),

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

      status: 'pendente',

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

    throw erro(
      'ID da loja inválido.'
    );

  }


  const loja =
    await lojaRepository
      .buscarLojaPorId(id);


  if (!loja) {

    throw erro(
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

    throw erro(
      'ID do proprietário inválido.'
    );

  }


  const loja =
    await lojaRepository
      .buscarLojaDoProprietario(
        proprietarioId
      );


  if (!loja) {

    throw erro(
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

    throw erro(
      'ID da loja inválido.'
    );

  }


  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );


  if (!loja) {

    throw erro(
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

      throw erro(
        'O nome da loja não pode ser vazio.'
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

      throw erro(
        'A descrição deve ser um texto.'
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

      throw erro(
        'A categoria da loja não pode ser vazia.'
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

      throw erro(
        'A foto deve ser um texto.'
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

      throw erro(
        'O banner deve ser um texto.'
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

      throw erro(
        'O telefone da loja não pode ser vazio.'
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

      throw erro(
        'CEP, logradouro, número, bairro, cidade e estado são obrigatórios no endereço.'
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

    throw erro(
      'ID da loja inválido.'
    );

  }


  if (
    !horarios ||
    typeof horarios !== 'object' ||
    Array.isArray(horarios)
  ) {

    throw erro(
      'Informe os horários da loja.'
    );

  }


  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );


  if (!loja) {

    throw erro(
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

    throw erro(
      'ID da loja inválido.'
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

    throw erro(
      'Status inválido.'
    );

  }


  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );


  if (!loja) {

    throw erro(
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

    throw erro(
      'ID da loja inválido.'
    );

  }


  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );


  if (!loja) {

    throw erro(
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

    throw erro(
      'ID da loja inválido.'
    );

  }


  const loja =
    await lojaRepository
      .buscarLojaPorIdSemPopulate(
        id
      );


  if (!loja) {

    throw erro(
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

