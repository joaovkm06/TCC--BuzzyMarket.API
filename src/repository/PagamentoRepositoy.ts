import { PagamentoModel } from '../model/pagamento';


// =====================================================
// CRIAR PAGAMENTO
// =====================================================

export async function criarPagamento(dados: any) {
  return await PagamentoModel.create(dados);
}


// =====================================================
// LISTAR TODOS OS PAGAMENTOS
// =====================================================

export async function listarPagamentos() {
  return await PagamentoModel
    .find()
    .populate(
      'pedidoId',
      'usuarioId lojaId valorTotal status criadoEm'
    )
    .sort({
      criadoEm: -1
    });
}


// =====================================================
// BUSCAR PAGAMENTO POR ID
// =====================================================

export async function buscarPagamentoPorId(
  id: string
) {
  return await PagamentoModel
    .findById(id)
    .populate(
      'pedidoId',
      'usuarioId lojaId itens valorTotal status criadoEm'
    );
}


// =====================================================
// BUSCAR SEM POPULATE
// =====================================================

export async function buscarPagamentoSemPopulate(
  id: string
) {
  return await PagamentoModel.findById(id);
}


// =====================================================
// BUSCAR PAGAMENTO POR PEDIDO
// =====================================================

export async function buscarPagamentoPorPedido(
  pedidoId: string
) {
  return await PagamentoModel
    .findOne({
      pedidoId
    })
    .populate(
      'pedidoId',
      'usuarioId lojaId itens valorTotal status criadoEm'
    );
}


// =====================================================
// ATUALIZAR PAGAMENTO
// =====================================================

export async function atualizarPagamento(
  id: string,
  dados: any
) {
  return await PagamentoModel
    .findByIdAndUpdate(
      id,
      dados,
      {
        new: true,
        runValidators: true
      }
    )
    .populate(
      'pedidoId',
      'usuarioId lojaId itens valorTotal status criadoEm'
    );
}


// =====================================================
// EXCLUIR PAGAMENTO
// =====================================================

export async function excluirPagamento(
  id: string
) {
  return await PagamentoModel.findByIdAndDelete(id);
}