import { CarrinhoModel } from '../model/carrinho';

export async function criarCarrinho(dados: any) {
  return await CarrinhoModel.create(dados);
}

export async function buscarCarrinhoPorUsuario(usuarioId: string) {
  return await CarrinhoModel
    .findOne({ usuarioId })
    .populate('usuarioId', 'nome email perfil')
    .populate('itens.produtoId', 'nome preco imagem estoque ativo lojaId');
}

export async function buscarCarrinhoSemPopulate(usuarioId: string) {
  return await CarrinhoModel.findOne({ usuarioId });
}

export async function buscarCarrinhoPorId(id: string) {
  return await CarrinhoModel
    .findById(id)
    .populate('usuarioId', 'nome email perfil')
    .populate('itens.produtoId', 'nome preco imagem estoque ativo lojaId');
}

export async function adicionarItem(
  usuarioId: string,
  item: any
) {
  return await CarrinhoModel.findOneAndUpdate(
    { usuarioId },
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
    .populate('usuarioId', 'nome email perfil')
    .populate('itens.produtoId', 'nome preco imagem estoque ativo lojaId');
}

export async function atualizarItem(
  usuarioId: string,
  produtoId: string,
  quantidade: number
) {
  return await CarrinhoModel.findOneAndUpdate(
    {
      usuarioId,
      'itens.produtoId': produtoId
    },
    {
      $set: {
        'itens.$.quantidade': quantidade
      }
    },
    {
      new: true,
      runValidators: true
    }
  )
    .populate('usuarioId', 'nome email perfil')
    .populate('itens.produtoId', 'nome preco imagem estoque ativo lojaId');
}

export async function removerItem(
  usuarioId: string,
  produtoId: string
) {
  return await CarrinhoModel.findOneAndUpdate(
    { usuarioId },
    {
      $pull: {
        itens: {
          produtoId
        }
      }
    },
    {
      new: true
    }
  )
    .populate('usuarioId', 'nome email perfil')
    .populate('itens.produtoId', 'nome preco imagem estoque ativo lojaId');
}

export async function limparCarrinho(usuarioId: string) {
  return await CarrinhoModel.findOneAndUpdate(
    { usuarioId },
    {
      $set: {
        itens: []
      }
    },
    {
      new: true
    }
  )
    .populate('usuarioId', 'nome email perfil')
    .populate('itens.produtoId', 'nome preco imagem estoque ativo lojaId');
}

export async function excluirCarrinho(usuarioId: string) {
  return await CarrinhoModel.findOneAndDelete({
    usuarioId
  });
}