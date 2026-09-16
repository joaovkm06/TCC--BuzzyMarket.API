
import { Types } from 'mongoose';
import { ProdutoModel } from '../model/produto';


// ==========================================
// CRIAR PRODUTO
// ==========================================

export async function criarProduto(
  dados: any
) {
  return await ProdutoModel.create(dados);
}


// ==========================================
// LISTAR PRODUTOS
// ==========================================

export async function listarProdutos() {
  return await ProdutoModel
    .find()
    .populate(
      'lojaId',
      'nome categoria status'
    )
    .sort({
      criadoEm: -1
    });
}


// ==========================================
// BUSCAR PRODUTO POR ID
// ==========================================

export async function buscarProdutoPorId(
  id: string
) {
  return await ProdutoModel
    .findById(id)
    .populate(
      'lojaId',
      'nome categoria status'
    );
}


// ==========================================
// BUSCAR SEM POPULATE
// ==========================================

export async function buscarProdutoSemPopulate(
  id: string
) {
  return await ProdutoModel.findById(id);
}


// ==========================================
// PRODUTOS DA LOJA
// ==========================================

export async function listarProdutosPorLoja(
  lojaId: string
) {
  return await ProdutoModel
    .find({
      lojaId: new Types.ObjectId(lojaId)
    })
    .populate(
      'lojaId',
      'nome categoria status'
    )
    .sort({
      criadoEm: -1
    });
}


// ==========================================
// ATUALIZAR
// ==========================================

export async function atualizarProduto(
  id: string,
  dados: any
) {
  return await ProdutoModel
    .findByIdAndUpdate(
      id,
      dados,
      {
        new: true,
        runValidators: true
      }
    )
    .populate(
      'lojaId',
      'nome categoria status'
    );
} 


export async function alterarEstoque(
  produtoId: string,
  quantidade: number
) {
  return await ProdutoModel.findByIdAndUpdate(
    produtoId,
    {
      $inc: {
        estoque: quantidade
      }
    },
    {
      new: true,
      runValidators: true
    }
  );
}

// ==========================================
// EXCLUIR
// ==========================================

export async function excluirProduto(
  id: string
) {
  return await ProdutoModel.findByIdAndDelete(id);
}


export function atualizarEstoque(arg0: any, arg1: number) {
  throw new Error('Function not implemented.');
}



