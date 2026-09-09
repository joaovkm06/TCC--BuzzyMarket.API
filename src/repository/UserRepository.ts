import { UserModel } from '../model/usuario';

export async function criarUsuario(dados: any) {
  return await UserModel.create(dados);
}

export async function listarUsuarios() {
  return await UserModel
    .find()
    .populate('lojaId', 'nome categoria status');
}

export async function buscarUsuarioPorId(id: string) {
  return await UserModel
    .findById(id)
    .populate('lojaId', 'nome categoria status');
}

export async function buscarUsuarioSemPopulate(id: string) {
  return await UserModel.findById(id);
}

export async function atualizarUsuario(
  id: string,
  dados: any
) {
  return await UserModel
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

export async function excluirUsuario(id: string) {
  return await UserModel.findByIdAndDelete(id);
}

export function removerLojaDoUsuario(arg0: string) {
    throw new Error('Function not implemented.');
}
export function removerLojaDosFuncionarios(id: string) {
    throw new Error('Function not implemented.');
}

