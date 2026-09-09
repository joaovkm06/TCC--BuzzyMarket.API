import { UserProfile } from '../model/usuario';
import { StatusLoja } from '../model/loja';

import * as lojaRepository from '../repository/LojaRepository';
import * as userRepository from '../repository/UserRepository';


export async function criarLoja(dados: any) {

  const {
    nome,
    descricao,
    categoria,
    foto,
    banner,
    telefone,
    endereco,
    proprietarioId,
    horarios
  } = dados;


  // ==============================
  // VALIDAÇÕES
  // ==============================

  if (
    !nome ||
    !categoria ||
    !telefone ||
    !endereco ||
    !proprietarioId
  ) {

    const erro: any = new Error(
      'Nome, categoria, telefone, endereco e proprietarioId são obrigatórios.'
    );

    erro.status = 400;

    throw erro;
  }


  // ==============================
  // VALIDAÇÃO DO ENDEREÇO
  // ==============================

  if (
    !endereco.cep ||
    !endereco.logradouro ||
    !endereco.numero ||
    !endereco.bairro ||
    !endereco.cidade ||
    !endereco.estado
  ) {

    const erro: any = new Error(
      'CEP, logradouro, número, bairro, cidade e estado são obrigatórios no endereço.'
    );

    erro.status = 400;

    throw erro;
  }


  // ==============================
  // VERIFICA PROPRIETÁRIO
  // ==============================

  const proprietario =
    await userRepository.buscarUsuarioSemPopulate(proprietarioId);

  if (!proprietario) {

    const erro: any = new Error(
      'Proprietário não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


  // ==============================
  // SOMENTE LOGISTA
  // ==============================

  if (proprietario.perfil !== UserProfile.Logista) {

    const erro: any = new Error(
      'Somente usuários com perfil logista podem ser proprietários de uma loja.'
    );

    erro.status = 400;

    throw erro;
  }


  // ==============================
  // VERIFICA SE JÁ POSSUI LOJA
  // ==============================

  const lojaExistente =
    await lojaRepository.buscarLojaDoProprietario(
      proprietarioId
    );

  if (lojaExistente) {

    const erro: any = new Error(
      'Este usuário já possui uma loja.'
    );

    erro.status = 400;

    throw erro;
  }


  // ==============================
  // CRIA LOJA
  // ==============================

  const loja = await lojaRepository.criarLoja({
    nome,
    descricao,
    categoria,
    foto,
    banner,
    telefone,
    endereco,
    proprietarioId,
    horarios: horarios || {}
  });


  // ==============================
  // VINCULA LOJA AO USUÁRIO
  // ==============================

  await userRepository.atualizarUsuario(
    proprietarioId,
    {
      lojaId: loja._id
    }
  );


  return loja;
}


// ==========================================
// LISTAR LOJAS
// ==========================================

export async function listarLojas() {

  return await lojaRepository.listarLojas();

}


// ==========================================
// BUSCAR LOJA POR ID
// ==========================================

export async function buscarLojaPorId(id: string) {

  const loja =
    await lojaRepository.buscarLojaPorId(id);

  if (!loja) {

    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }

  return loja;
}


// ==========================================
// ATUALIZAR LOJA
// ==========================================

export async function atualizarLoja(
  id: string,
  dados: any
) {

  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(id);

  if (!loja) {

    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
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


  // ==============================
  // ATUALIZA CAMPOS
  // ==============================

  if (nome !== undefined) {
    loja.nome = nome;
  }

  if (descricao !== undefined) {
    loja.descricao = descricao;
  }

  if (categoria !== undefined) {
    loja.categoria = categoria;
  }

  if (foto !== undefined) {
    loja.foto = foto;
  }

  if (banner !== undefined) {
    loja.banner = banner;
  }

  if (telefone !== undefined) {
    loja.telefone = telefone;
  }


  // ==============================
  // ENDEREÇO
  // ==============================

  if (endereco !== undefined) {

    if (
      !endereco.cep ||
      !endereco.logradouro ||
      !endereco.numero ||
      !endereco.bairro ||
      !endereco.cidade ||
      !endereco.estado
    ) {

      const erro: any = new Error(
        'CEP, logradouro, número, bairro, cidade e estado são obrigatórios no endereço.'
      );

      erro.status = 400;

      throw erro;
    }

    loja.endereco = endereco;
  }


  await loja.save();

  return loja;
}


// ==========================================
// ATUALIZAR HORÁRIOS
// ==========================================

export async function atualizarHorarios(
  id: string,
  horarios: any
) {

  if (!horarios || typeof horarios !== 'object') {

    const erro: any = new Error(
      'Informe os horários da loja.'
    );

    erro.status = 400;

    throw erro;
  }


  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(id);

  if (!loja) {

    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }


  loja.horarios = horarios;

  await loja.save();

  return loja;
}


// ==========================================
// ATUALIZAR STATUS
// ==========================================

export async function atualizarStatusLoja(
  id: string,
  status: StatusLoja
) {

  const statusPermitidos: StatusLoja[] = [
    'pendente',
    'aprovada',
    'rejeitada',
    'bloqueada'
  ];


  if (!statusPermitidos.includes(status)) {

    const erro: any = new Error(
      'Status inválido.'
    );

    erro.status = 400;

    throw erro;
  }


  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(id);

  if (!loja) {

    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }


  loja.status = status;

  await loja.save();

  return loja;
}


// ==========================================
// VERIFICAR SE A LOJA ESTÁ ABERTA
// ==========================================

export async function verificarLojaAberta(
  id: string
) {

  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(id);

  if (!loja) {

    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }


  // Loja não aprovada não funciona

  if (loja.status !== 'aprovada') {

    return {
      aberta: false,
      motivo: `Loja está ${loja.status}.`
    };
  }


  const agora = new Date();

  const diaSemana = agora.getDay();


  const dias = [
    'domingo',
    'segunda',
    'terca',
    'quarta',
    'quinta',
    'sexta',
    'sabado'
  ];


  const diaAtual = dias[diaSemana];


  const horario =
    loja.horarios?.[
      diaAtual as keyof typeof loja.horarios
    ];


  // Não possui horário

  if (!horario) {

    return {
      aberta: false,
      dia: diaAtual,
      mensagem: 'A loja está fechada hoje.'
    };
  }


  const horaAtual =
    agora.getHours()
      .toString()
      .padStart(2, '0') +
    ':' +
    agora.getMinutes()
      .toString()
      .padStart(2, '0');


  const aberta =
    horaAtual >= horario.abertura &&
    horaAtual < horario.fechamento;


  return {
    aberta,
    dia: diaAtual,
    horario,
    horaAtual
  };
}


// ==========================================
// EXCLUIR LOJA
// ==========================================

export async function excluirLoja(id: string) {

  const loja =
    await lojaRepository.buscarLojaPorIdSemPopulate(id);

  if (!loja) {

    const erro: any = new Error(
      'Loja não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }


  // Remove loja do proprietário

  await userRepository.removerLojaDoUsuario(
    loja.proprietarioId.toString()
  );


  // Remove loja dos funcionários

  await userRepository.removerLojaDosFuncionarios(
    id
  );


  // Exclui loja

  await lojaRepository.excluirLoja(id);

  return true;
}