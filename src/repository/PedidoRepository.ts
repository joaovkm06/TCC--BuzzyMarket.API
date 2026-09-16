
import { Types } from 'mongoose';

import { PedidoModel } from '../model/pedido';


// ======================================================
// CRIAR PEDIDO
// ======================================================

export async function criarPedido(
  dados: any
) {

  return await PedidoModel.create(
    dados
  );

}


// ======================================================
// LISTAR TODOS OS PEDIDOS
// ======================================================

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


// ======================================================
// BUSCAR PEDIDO POR ID
// ======================================================

export async function buscarPedidoPorId(
  id: string
) {

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


// ======================================================
// BUSCAR PEDIDO SEM POPULATE
// ======================================================

export async function buscarPedidoSemPopulate(
  id: string
) {

  return await PedidoModel.findById(
    id
  );

}


// ======================================================
// LISTAR PEDIDOS POR USUÁRIO
// ======================================================

export async function listarPedidosPorUsuario(
  usuarioId: string
) {

  return await PedidoModel

    .find({
      usuarioId: new Types.ObjectId(
        usuarioId
      )
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


// ======================================================
// LISTAR PEDIDOS POR LOJA
// ======================================================

export async function listarPedidosPorLoja(
  lojaId: string
) {

  return await PedidoModel

    .find({
      lojaId: new Types.ObjectId(
        lojaId
      )
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


// ======================================================
// ATUALIZAR PEDIDO
// ======================================================

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


// ======================================================
// EXCLUIR PEDIDO
// ======================================================

export async function excluirPedido(
  id: string
) {

  return await PedidoModel.findByIdAndDelete(
    id
  );

}

