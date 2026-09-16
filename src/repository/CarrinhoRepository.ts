
import { Types } from 'mongoose';

import { CarrinhoModel } from '../model/carrinho';


// =====================================================
// CRIAR CARRINHO
// =====================================================

export async function criarCarrinho(
  dados: any
) {

  return await CarrinhoModel.create(
    dados
  );

}


// =====================================================
// BUSCAR CARRINHO POR USUÁRIO
// =====================================================

export async function buscarCarrinhoPorUsuario(
  usuarioId: string
) {

  return await CarrinhoModel

    .findOne({
      usuarioId: new Types.ObjectId(usuarioId)
    })

    .populate(
      'usuarioId',
      'nome email perfil'
    )

    .populate(
      'itens.produtoId',
      'nome preco imagem estoque ativo lojaId'
    );

}


// =====================================================
// BUSCAR CARRINHO SEM POPULATE
// =====================================================

export async function buscarCarrinhoSemPopulate(
  usuarioId: string
) {

  return await CarrinhoModel.findOne({

    usuarioId:
      new Types.ObjectId(usuarioId)

  });

}


// =====================================================
// BUSCAR CARRINHO POR ID
// =====================================================

export async function buscarCarrinhoPorId(
  id: string
) {

  return await CarrinhoModel

    .findById(id)

    .populate(
      'usuarioId',
      'nome email perfil'
    )

    .populate(
      'itens.produtoId',
      'nome preco imagem estoque ativo lojaId'
    );

}


// =====================================================
// ADICIONAR ITEM
// =====================================================

export async function adicionarItem(
  usuarioId: string,
  item: any
) {

  return await CarrinhoModel.findOneAndUpdate(

    {
      usuarioId:
        new Types.ObjectId(usuarioId)
    },

    {

      $push: {

        itens: item

      }

    },

    {

      new: true,

      upsert: true,

      runValidators: true

    }

  )

    .populate(
      'usuarioId',
      'nome email perfil'
    )

    .populate(
      'itens.produtoId',
      'nome preco imagem estoque ativo lojaId'
    );

}


// =====================================================
// ATUALIZAR QUANTIDADE DO ITEM
// =====================================================

export async function atualizarItem(
  usuarioId: string,
  produtoId: string,
  quantidade: number
) {

  return await CarrinhoModel.findOneAndUpdate(

    {

      usuarioId:
        new Types.ObjectId(usuarioId),

      'itens.produtoId':
        new Types.ObjectId(produtoId)

    },

    {

      $set: {

        'itens.$.quantidade':
          quantidade

      }

    },

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
      'itens.produtoId',
      'nome preco imagem estoque ativo lojaId'
    );

}


// =====================================================
// REMOVER ITEM
// =====================================================

export async function removerItem(
  usuarioId: string,
  produtoId: string
) {

  return await CarrinhoModel.findOneAndUpdate(

    {

      usuarioId:
        new Types.ObjectId(usuarioId)

    },

    {

      $pull: {

        itens: {

          produtoId:
            new Types.ObjectId(produtoId)

        }

      }

    },

    {

      new: true

    }

  )

    .populate(
      'usuarioId',
      'nome email perfil'
    )

    .populate(
      'itens.produtoId',
      'nome preco imagem estoque ativo lojaId'
    );

}


// =====================================================
// LIMPAR CARRINHO
// =====================================================

export async function limparCarrinho(
  usuarioId: string
) {

  return await CarrinhoModel.findOneAndUpdate(

    {

      usuarioId:
        new Types.ObjectId(usuarioId)

    },

    {

      $set: {

        itens: []

      }

    },

    {

      new: true

    }

  )

    .populate(
      'usuarioId',
      'nome email perfil'
    )

    .populate(
      'itens.produtoId',
      'nome preco imagem estoque ativo lojaId'
    );

}


// =====================================================
// EXCLUIR CARRINHO
// =====================================================

export async function excluirCarrinho(
  usuarioId: string
) {

  return await CarrinhoModel.findOneAndDelete({

    usuarioId:
      new Types.ObjectId(usuarioId)

  });

}

