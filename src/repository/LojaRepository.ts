import { Types } from 'mongoose';
import { Loja, LojaModel, StatusLoja } from '../model/loja';


// ======================================================
// CRIAR LOJA
// ======================================================

export async function criarLoja(dados: any) {
  return await LojaModel.create(dados);
}


// ======================================================
// LISTAR TODAS AS LOJAS
// ======================================================

export async function listarLojas() {
  return await LojaModel
    .find()
    .populate(
      'proprietarioId',
      'nome email perfil'
    )
    .sort({ criadoEm: -1 });
}


// ======================================================
// BUSCAR LOJA POR ID
// ======================================================

export async function buscarLojaPorId(id: string) {
  return await LojaModel
    .findById(id)
    .populate(
      'proprietarioId',
      'nome email perfil'
    );
}


// ======================================================
// BUSCAR LOJA SEM POPULATE
// ======================================================

export async function buscarLojaPorIdSemPopulate(id: string) {
  return await LojaModel.findById(id);
}


// ======================================================
// BUSCAR LOJA PELO PROPRIETÁRIO
// ======================================================

export async function buscarLojaDoProprietario(
  proprietarioId: string
) {
  return await LojaModel.findOne({
    proprietarioId: new Types.ObjectId(proprietarioId)
  });
}


// ======================================================
// BUSCAR LOJAS POR STATUS
// ======================================================

export async function buscarLojasPorStatus(
  status: StatusLoja
): Promise<Loja[]> {
  return await LojaModel
    .find({ status })
    .populate(
      'proprietarioId',
      'nome email perfil'
    )
    .sort({ criadoEm: -1 });
}


// ======================================================
// BUSCAR LOJAS POR CATEGORIA
// ======================================================

export async function buscarLojasPorCategoria(
  categoria: string
) {
  return await LojaModel
    .find({
      categoria: {
        $regex: categoria,
        $options: 'i'
      }
    })
    .populate(
      'proprietarioId',
      'nome email perfil'
    )
    .sort({ nome: 1 });
}


// ======================================================
// BUSCAR LOJAS POR CIDADE
// ======================================================

export async function buscarLojasPorCidade(
  cidade: string
) {
  return await LojaModel
    .find({
      'endereco.cidade': {
        $regex: cidade,
        $options: 'i'
      }
    })
    .populate(
      'proprietarioId',
      'nome email perfil'
    )
    .sort({ nome: 1 });
}


// ======================================================
// ATUALIZAR LOJA
// ======================================================

export async function atualizarLoja(
  id: string,
  dados: any
) {
  return await LojaModel
    .findByIdAndUpdate(
      id,
      dados,
      {
        new: true,
        runValidators: true
      }
    )
    .populate(
      'proprietarioId',
      'nome email perfil'
    );
}


// ======================================================
// ATUALIZAR STATUS DA LOJA
// ======================================================

export async function atualizarStatusLoja(
  id: string,
  status: string
) {
  return await LojaModel
    .findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true
      }
    )
    .populate(
      'proprietarioId',
      'nome email perfil'
    );
}


// ======================================================
// EXCLUIR LOJA
// ======================================================

export async function excluirLoja(id: string) {
  return await LojaModel.findByIdAndDelete(id);
}


// ======================================================
// VERIFICAR SE LOJA EXISTE
// ======================================================

export async function lojaExiste(id: string) {
  return await LojaModel.exists({
    _id: id
  });
}


// ======================================================
// VERIFICAR SE PROPRIETÁRIO JÁ POSSUI LOJA
// ======================================================

export async function proprietarioJaPossuiLoja(
  proprietarioId: string
) {
  return await LojaModel.exists({
    proprietarioId: new Types.ObjectId(proprietarioId)
  });
}

export async function buscarLojaDoUsuario(id: string) {
  return await LojaModel.findOne({
    proprietarioId: new Types.ObjectId(id)
  }).populate(
    'proprietarioId',
    'nome email perfil'
  );
}
