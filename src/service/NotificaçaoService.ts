
import { Types } from 'mongoose';

import * as notificacaoRepository
  from '../repository/NotificaçaoRepository';

import * as userRepository
  from '../repository/UserRepository';


// =====================================================
// ERRO PADRÃO
// =====================================================

function erro(
  mensagem: string,
  status = 400
) {

  const error: any = new Error(
    mensagem
  );

  error.status = status;

  return error;
}


// =====================================================
// TIPOS PERMITIDOS
// =====================================================

const tiposPermitidos = [
  'loja',
  'pedido',
  'pagamento',
  'sistema',
  'personalizada'
];


// =====================================================
// CRIAR NOTIFICAÇÃO
// =====================================================

export async function criarNotificacao(
  dados: any
) {

  const {
    remetenteId,
    usuarioId,
    titulo,
    mensagem,
    tipo
  } = dados;


  // ===================================================
  // VALIDAÇÕES
  // ===================================================

  if (
    !usuarioId ||
    !titulo ||
    !mensagem ||
    !tipo
  ) {

    throw erro(
      'usuarioId, titulo, mensagem e tipo são obrigatórios.'
    );

  }


  if (
    !Types.ObjectId.isValid(
      usuarioId.toString()
    )
  ) {

    throw erro(
      'usuarioId inválido.'
    );

  }


  if (remetenteId) {

    if (
      !Types.ObjectId.isValid(
        remetenteId.toString()
      )
    ) {

      throw erro(
        'remetenteId inválido.'
      );

    }

  }


  // ===================================================
  // VALIDA TIPO
  // ===================================================

  if (
    !tiposPermitidos.includes(tipo)
  ) {

    const error: any = erro(
      'Tipo de notificação inválido.'
    );

    error.tiposPermitidos =
      tiposPermitidos;

    throw error;

  }


  // ===================================================
  // VERIFICA DESTINATÁRIO
  // ===================================================

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId.toString()
    );


  if (!usuario) {

    throw erro(
      'Usuário que receberá a notificação não encontrado.',
      404
    );

  }


  // ===================================================
  // VERIFICA REMETENTE
  // ===================================================

  if (remetenteId) {

    const remetente =
      await userRepository.buscarUsuarioSemPopulate(
        remetenteId.toString()
      );


    if (!remetente) {

      throw erro(
        'Usuário remetente não encontrado.',
        404
      );

    }

  }


  // ===================================================
  // CRIA NOTIFICAÇÃO
  // ===================================================

  const notificacao =
    await notificacaoRepository.criarNotificacao({

      remetenteId:
        remetenteId
          ? new Types.ObjectId(
              remetenteId.toString()
            )
          : undefined,

      usuarioId:
        new Types.ObjectId(
          usuarioId.toString()
        ),

      titulo,

      mensagem,

      tipo,

      lida: false

    });


  // ===================================================
  // RETORNA POPULADA
  // =====================================================

  return await notificacaoRepository
    .buscarNotificacaoPorId(
      notificacao._id.toString()
    );

}


// =====================================================
// LISTAR TODAS
// =====================================================

export async function listarNotificacoes() {

  return await notificacaoRepository
    .listarNotificacoes();

}


// =====================================================
// BUSCAR POR ID
// =====================================================

export async function buscarNotificacaoPorId(
  id: string
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw erro(
      'ID da notificação inválido.'
    );

  }


  const notificacao =
    await notificacaoRepository
      .buscarNotificacaoPorId(id);


  if (!notificacao) {

    throw erro(
      'Notificação não encontrada.',
      404
    );

  }


  return notificacao;

}


// =====================================================
// LISTAR POR USUÁRIO
// =====================================================

export async function listarNotificacoesPorUsuario(
  usuarioId: string
) {

  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw erro(
      'usuarioId inválido.'
    );

  }


  // ===================================================
  // VERIFICA USUÁRIO
  // ===================================================

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId
    );


  if (!usuario) {

    throw erro(
      'Usuário não encontrado.',
      404
    );

  }


  // ===================================================
  // BUSCA NOTIFICAÇÕES
  // ===================================================

  const notificacoes =
    await notificacaoRepository
      .listarNotificacoesPorUsuario(
        usuarioId
      );


  // ===================================================
  // CONTADORES
  // ===================================================

  const total =
    notificacoes.length;


  const naoLidas =
    notificacoes.filter(
      (notificacao: any) =>
        !notificacao.lida
    ).length;


  return {

    usuario: {

      id: usuario._id,

      nome: usuario.nome,

      email: usuario.email

    },

    total,

    naoLidas,

    notificacoes

  };

}


// =====================================================
// MARCAR COMO LIDA / NÃO LIDA
// =====================================================

export async function atualizarLeitura(
  id: string,
  lida: boolean
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw erro(
      'ID da notificação inválido.'
    );

  }


  if (
    typeof lida !== 'boolean'
  ) {

    throw erro(
      'O campo lida deve ser true ou false.'
    );

  }


  const notificacao =
    await notificacaoRepository
      .buscarNotificacaoSemPopulate(id);


  if (!notificacao) {

    throw erro(
      'Notificação não encontrada.',
      404
    );

  }


  notificacao.lida = lida;

  await notificacao.save();


  return await notificacaoRepository
    .buscarNotificacaoPorId(id);

}


// =====================================================
// MARCAR TODAS COMO LIDAS
// =====================================================

export async function marcarTodasComoLidas(
  usuarioId: string
) {

  if (
    !Types.ObjectId.isValid(usuarioId)
  ) {

    throw erro(
      'usuarioId inválido.'
    );

  }


  // ===================================================
  // VERIFICA USUÁRIO
  // ===================================================

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId
    );


  if (!usuario) {

    throw erro(
      'Usuário não encontrado.',
      404
    );

  }


  // ===================================================
  // MARCA TODAS
  // ===================================================

  const resultado =
    await notificacaoRepository
      .marcarTodasComoLidas(
        usuarioId
      );


  return {

    notificacoesAtualizadas:
      resultado.modifiedCount

  };

}


// =====================================================
// EXCLUIR
// =====================================================

export async function excluirNotificacao(
  id: string
) {

  if (
    !Types.ObjectId.isValid(id)
  ) {

    throw erro(
      'ID da notificação inválido.'
    );

  }


  const notificacao =
    await notificacaoRepository
      .buscarNotificacaoSemPopulate(id);


  if (!notificacao) {

    throw erro(
      'Notificação não encontrada.',
      404
    );

  }


  await notificacaoRepository
    .excluirNotificacao(id);


  return true;

}

