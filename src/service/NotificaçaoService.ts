import * as notificacaoRepository
  from '../repository/NotificaçaoRepository';

import * as userRepository
  from '../repository/UserRepository';


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
  // VALIDAÇÃO
  // ===================================================

  if (
    !usuarioId ||
    !titulo ||
    !mensagem ||
    !tipo
  ) {

    const erro: any = new Error(
      'usuarioId, titulo, mensagem e tipo são obrigatórios.'
    );

    erro.status = 400;

    throw erro;
  }


  // ===================================================
  // TIPOS PERMITIDOS
  // ===================================================

  const tiposPermitidos = [
    'loja',
    'pedido',
    'pagamento',
    'sistema',
    'personalizada'
  ];


  if (!tiposPermitidos.includes(tipo)) {

    const erro: any = new Error(
      'Tipo de notificação inválido.'
    );

    erro.status = 400;
    erro.tiposPermitidos = tiposPermitidos;

    throw erro;
  }


  // ===================================================
  // VERIFICA USUÁRIO DESTINATÁRIO
  // ===================================================

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId.toString()
    );


  if (!usuario) {

    const erro: any = new Error(
      'Usuário que receberá a notificação não encontrado.'
    );

    erro.status = 404;

    throw erro;
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

      const erro: any = new Error(
        'Usuário remetente não encontrado.'
      );

      erro.status = 404;

      throw erro;
    }
  }


  // ===================================================
  // CRIA
  // ===================================================

  const notificacao =
    await notificacaoRepository.criarNotificacao({

      remetenteId,

      usuarioId,

      titulo,

      mensagem,

      tipo,

      lida: false

    });


  // ===================================================
  // RETORNA POPULADA
  // ===================================================

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

  const notificacao =
    await notificacaoRepository
      .buscarNotificacaoPorId(id);


  if (!notificacao) {

    const erro: any = new Error(
      'Notificação não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }


  return notificacao;
}


// =====================================================
// LISTAR POR USUÁRIO
// =====================================================

export async function listarNotificacoesPorUsuario(
  usuarioId: string
) {

  // Verifica usuário

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId
    );


  if (!usuario) {

    const erro: any = new Error(
      'Usuário não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


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
        (      notificacao: { lida: any; }) => !notificacao.lida
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

  if (typeof lida !== 'boolean') {

    const erro: any = new Error(
      'O campo lida deve ser true ou false.'
    );

    erro.status = 400;

    throw erro;
  }


  const notificacao =
    await notificacaoRepository
      .buscarNotificacaoSemPopulate(id);


  if (!notificacao) {

    const erro: any = new Error(
      'Notificação não encontrada.'
    );

    erro.status = 404;

    throw erro;
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

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      usuarioId
    );


  if (!usuario) {

    const erro: any = new Error(
      'Usuário não encontrado.'
    );

    erro.status = 404;

    throw erro;
  }


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

  const notificacao =
    await notificacaoRepository
      .buscarNotificacaoSemPopulate(id);


  if (!notificacao) {

    const erro: any = new Error(
      'Notificação não encontrada.'
    );

    erro.status = 404;

    throw erro;
  }


  await notificacaoRepository
    .excluirNotificacao(id);


  return true;
}