import { NotificacaoModel } from '../model/notificaçao';


// =====================================================
// CRIAR NOTIFICAÇÃO
// =====================================================

export async function criarNotificacao(dados: any) {
  return await NotificacaoModel.create(dados);
}


// =====================================================
// LISTAR TODAS
// =====================================================

export async function listarNotificacoes() {
  return await NotificacaoModel
    .find()
    .populate(
      'usuarioId',
      'nome email perfil'
    )
    .populate(
      'remetenteId',
      'nome email perfil'
    )
    .sort({
      criadoEm: -1
    });
}


// =====================================================
// BUSCAR POR ID
// =====================================================

export async function buscarNotificacaoPorId(
  id: string
) {
  return await NotificacaoModel
    .findById(id)
    .populate(
      'usuarioId',
      'nome email perfil'
    )
    .populate(
      'remetenteId',
      'nome email perfil'
    );
}


// =====================================================
// BUSCAR SEM POPULATE
// =====================================================

export async function buscarNotificacaoSemPopulate(
  id: string
) {
  return await NotificacaoModel.findById(id);
}


// =====================================================
// LISTAR POR USUÁRIO
// =====================================================

export async function listarNotificacoesPorUsuario(
  usuarioId: string
) {
  return await NotificacaoModel
    .find({
      usuarioId
    })
    .populate(
      'remetenteId',
      'nome email perfil'
    )
    .sort({
      criadoEm: -1
    });
}


// =====================================================
// ATUALIZAR NOTIFICAÇÃO
// =====================================================

export async function atualizarNotificacao(
  id: string,
  dados: any
) {
  return await NotificacaoModel
    .findByIdAndUpdate(
      id,
      dados,
      {
        new: true,
        runValidators: true
      }
    )
    .populate(
      'usuarioId',
      'nome email perfil'
    )
    .populate(
      'remetenteId',
      'nome email perfil'
    );
}


// =====================================================
// MARCAR TODAS COMO LIDAS
// =====================================================

export async function marcarTodasComoLidas(
  usuarioId: string
) {
  return await NotificacaoModel.updateMany(
    {
      usuarioId,
      lida: false
    },
    {
      $set: {
        lida: true
      }
    }
  );
}


// =====================================================
// EXCLUIR
// =====================================================

export async function excluirNotificacao(
  id: string
) {
  return await NotificacaoModel.findByIdAndDelete(id);
}