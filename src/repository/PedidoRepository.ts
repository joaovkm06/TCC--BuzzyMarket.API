import { PedidoModel } from '../model/pedido';

export async function criarPedido(dados: any) {
  return await PedidoModel.create(dados);
}

export async function listarPedidos() {
  return await PedidoModel
    .find()
    .populate(
      'usuarioId',
      'nome email perfil'
    )
    .populate(
      'lojaId',
      'nome categoria telefone'
    )
    .populate(
      'itens.produtoId',
      'nome preco imagem'
    )
    .sort({
      criadoEm: -1
    });
}

export async function buscarPedidoPorId(id: string) {
  return await PedidoModel
    .findById(id)
    .populate(
      'usuarioId',
      'nome email perfil'
    )
    .populate(
      'lojaId',
      'nome categoria telefone'
    )
    .populate(
      'itens.produtoId',
      'nome preco imagem'
    );
}

export async function buscarPedidoSemPopulate(id: string) {
  return await PedidoModel.findById(id);
}

export async function listarPedidosPorUsuario(
  usuarioId: string
) {
  return await PedidoModel
    .find({
      usuarioId
    })
    .populate(
      'lojaId',
      'nome categoria telefone'
    )
    .populate(
      'itens.produtoId',
      'nome preco imagem'
    )
    .sort({
      criadoEm: -1
    });
}

export async function listarPedidosPorLoja(
  lojaId: string
) {
  return await PedidoModel
    .find({
      lojaId
    })
    .populate(
      'usuarioId',
      'nome email perfil'
    )
    .populate(
      'itens.produtoId',
      'nome preco imagem'
    )
    .sort({
      criadoEm: -1
    });
}

export async function atualizarPedido(
  id: string,
  dados: any
) {
  return await PedidoModel
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
      'lojaId',
      'nome categoria telefone'
    )
    .populate(
      'itens.produtoId',
      'nome preco imagem'
    );
}

export async function excluirPedido(
  id: string
) {
  return await PedidoModel.findByIdAndDelete(id);
}