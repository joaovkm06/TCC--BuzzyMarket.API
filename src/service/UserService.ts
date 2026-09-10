
import bcrypt from 'bcrypt';

import { LojaModel } from '../model/loja';

import {
  UserModel,
  UserProfile
} from '../model/usuario';

import * as userRepository
  from '../repository/UserRepository';

import * as lojaRepository
  from '../repository/LojaRepository';


// ======================================================
// POST /users
// ======================================================

export async function criarUsuario(
  dados: any
) {

  const {
    nome,
    email,
    senha,
    perfil,
    endereco,
    lojaId
  } = dados;


  // ====================================================
  // VALIDAR CAMPOS OBRIGATÓRIOS
  // ====================================================

  if (!nome) {
    const erro: any = new Error(
      'Nome é obrigatório.'
    );

    erro.status = 400;

    throw erro;
  }


  if (!email) {
    const erro: any = new Error(
      'Email é obrigatório.'
    );

    erro.status = 400;

    throw erro;
  }


  if (!senha) {
    const erro: any = new Error(
      'Senha é obrigatória.'
    );

    erro.status = 400;

    throw erro;
  }


  // ====================================================
  // VALIDAR PERFIL
  // ====================================================

  if (
    !Object.values(UserProfile).includes(perfil)
  ) {

    const erro: any =
      new Error(
        'Perfil de usuário inválido.'
      );

    erro.status = 400;

    erro.perfisPermitidos =
      Object.values(UserProfile);

    throw erro;
  }


  // ====================================================
  // CLIENTE E ADMIN NÃO PODEM TER LOJA
  // ====================================================

  if (
    (
      perfil === UserProfile.Cliente ||
      perfil === UserProfile.ADMIN
    ) &&
    lojaId
  ) {

    const erro: any =
      new Error(
        'Cliente e administrador não podem possuir lojaId.'
      );

    erro.status = 400;

    throw erro;
  }


  // ====================================================
  // FUNCIONÁRIO PRECISA DE LOJA
  // ====================================================

  if (
    perfil === UserProfile.Funcionario
  ) {

    if (!lojaId) {

      const erro: any =
        new Error(
          'Funcionário precisa estar vinculado a uma loja.'
        );

      erro.status = 400;

      throw erro;
    }


    const loja =
      await lojaRepository.buscarLojaPorId(
        lojaId.toString()
      );


    if (!loja) {

      const erro: any =
        new Error(
          'Loja não encontrada.'
        );

      erro.status = 404;

      throw erro;
    }
  }


  // ====================================================
  // LOGISTA
  // ====================================================

  /*
   * O lojista pode ser criado sem lojaId.
   *
   * Depois ele poderá criar sua própria loja.
   */

  if (
    perfil === UserProfile.Logista &&
    lojaId
  ) {

    const loja =
      await lojaRepository.buscarLojaPorId(
        lojaId.toString()
      );


    if (!loja) {

      const erro: any =
        new Error(
          'Loja não encontrada.'
        );

      erro.status = 404;

      throw erro;
    }


    if (
      loja.proprietarioId
    ) {

      const erro: any =
        new Error(
          'Esta loja já possui um proprietário.'
        );

      erro.status = 400;

      throw erro;
    }
  }


  // ====================================================
  // VERIFICAR EMAIL
  // ====================================================

  const usuarios =
    await userRepository.listarUsuarios();

  const emailExiste =
    usuarios.some(
      (usuario: any) =>
        usuario.email.toLowerCase() ===
        email.toLowerCase()
    );


  if (emailExiste) {

    const erro: any =
      new Error(
        'Este email já está cadastrado.'
      );

    erro.status = 400;

    throw erro;
  }


  // ====================================================
  // CRIPTOGRAFAR SENHA
  // ====================================================

  const senhaHash =
    await bcrypt.hash(
      senha,
      10
    );


  // ====================================================
  // CRIAR USUÁRIO
  // ====================================================

  return await userRepository.criarUsuario({

    nome,

    email,

    senhaHash,

    perfil,

    endereco,

    lojaId

  });
}



// ======================================================
// GET /users
// ======================================================

export async function listarUsuarios() {

  return await userRepository.listarUsuarios();

}



// ======================================================
// GET /users/:id
// ======================================================

export async function buscarUsuarioPorId(
  id: string
) {

  return await userRepository.buscarUsuarioPorId(
    id
  );

}



// ======================================================
// PUT /users/:id
// ======================================================

export async function atualizarUsuario(
  id: string,
  dados: any
) {

  const {
    nome,
    email,
    senha,
    perfil,
    endereco,
    lojaId
  } = dados;


  // ====================================================
  // BUSCAR USUÁRIO ATUAL
  // ====================================================

  const usuarioAtual =
    await userRepository.buscarUsuarioSemPopulate(
      id
    );


  if (!usuarioAtual) {

    const erro: any =
      new Error(
        'Usuário não encontrado.'
      );

    erro.status = 404;

    throw erro;
  }


  // ====================================================
  // DEFINIR PERFIL
  // ====================================================

  const perfilAtualizado =
    perfil || usuarioAtual.perfil;


  // ====================================================
  // VALIDAR PERFIL
  // ====================================================

  if (
    !Object.values(UserProfile).includes(
      perfilAtualizado
    )
  ) {

    const erro: any =
      new Error(
        'Perfil de usuário inválido.'
      );

    erro.status = 400;

    erro.perfisPermitidos =
      Object.values(UserProfile);

    throw erro;
  }


  // ====================================================
  // CLIENTE E ADMIN NÃO PODEM TER LOJA
  // ====================================================

  if (
    (
      perfilAtualizado === UserProfile.Cliente ||
      perfilAtualizado === UserProfile.ADMIN
    ) &&
    lojaId
  ) {

    const erro: any =
      new Error(
        'Cliente e administrador não podem possuir lojaId.'
      );

    erro.status = 400;

    throw erro;
  }


  // ====================================================
  // FUNCIONÁRIO
  // ====================================================

  if (
    perfilAtualizado ===
    UserProfile.Funcionario
  ) {

    const lojaFinal =
      lojaId ||
      usuarioAtual.lojaId;


    if (!lojaFinal) {

      const erro: any =
        new Error(
          'Funcionário precisa estar vinculado a uma loja.'
        );

      erro.status = 400;

      throw erro;
    }


    const loja =
      await lojaRepository.buscarLojaPorId(
        lojaFinal.toString()
      );


    if (!loja) {

      const erro: any =
        new Error(
          'Loja não encontrada.'
        );

      erro.status = 404;

      throw erro;
    }
  }


  // ====================================================
  // LOGISTA
  // ====================================================

  let lojaFinal =
    lojaId ||
    usuarioAtual.lojaId;


  if (
    perfilAtualizado ===
    UserProfile.Logista
  ) {

    if (lojaId) {

      const loja =
        await lojaRepository.buscarLojaPorId(
          lojaId.toString()
        );


      if (!loja) {

        const erro: any =
          new Error(
            'Loja não encontrada.'
          );

        erro.status = 404;

        throw erro;
      }


      if (
        loja.proprietarioId &&
        loja.proprietarioId.toString() !==
        usuarioAtual._id.toString()
      ) {

        const erro: any =
          new Error(
            'Esta loja já pertence a outro proprietário.'
          );

        erro.status = 400;

        throw erro;
      }
    }
  }


  // ====================================================
  // DEFINIR LOJA PARA SALVAR
  // ====================================================

  let lojaParaSalvar;


  if (
    perfilAtualizado ===
    UserProfile.Funcionario
  ) {

    lojaParaSalvar =
      lojaId ||
      usuarioAtual.lojaId;

  }

  else if (
    perfilAtualizado ===
    UserProfile.Logista
  ) {

    lojaParaSalvar =
      lojaFinal;

  }

  else {

    lojaParaSalvar =
      undefined;
  }


  // ====================================================
  // PREPARAR DADOS
  // ====================================================

  const dadosAtualizacao: any = {

    nome,

    email,

    perfil: perfilAtualizado,

    endereco,

    lojaId: lojaParaSalvar

  };


  // ====================================================
  // ATUALIZAR SENHA SE FOI INFORMADA
  // ====================================================

  if (senha) {

    dadosAtualizacao.senhaHash =
      await bcrypt.hash(
        senha,
        10
      );
  }


  // ====================================================
  // ATUALIZAR USUÁRIO
  // ====================================================

  return await userRepository.atualizarUsuario(
    id,
    dadosAtualizacao
  );
}



// ======================================================
// DELETE /users/:id
// ======================================================

export async function excluirUsuario(
  id: string
) {

  // ====================================================
  // BUSCAR USUÁRIO
  // ====================================================

  const usuario =
    await userRepository.buscarUsuarioSemPopulate(
      id
    );


  if (!usuario) {

    const erro: any =
      new Error(
        'Usuário não encontrado.'
      );

    erro.status = 404;

    throw erro;
  }


  // ====================================================
  // VERIFICAR SE É DONO DE UMA LOJA
  // ====================================================

  const loja =
    await lojaRepository.buscarLojaDoProprietario(
      id
    );


  if (loja) {

    const erro: any =
      new Error(
        'Não é possível excluir um usuário que possui uma loja.'
      );

    erro.status = 400;

    throw erro;
  }


  // ====================================================
  // EXCLUIR USUÁRIO
  // ====================================================

  return await userRepository.excluirUsuario(
    id
  );
}


// ======================================================
// CONTRATAR CLIENTE COMO FUNCIONÁRIO
// ======================================================

export async function contratarClienteComoFuncionario(
  clienteId: string,
  solicitanteId: string,
  lojaIdInformada?: string
) {
  // ------------------------------------------------------
  // 1. Buscar quem está fazendo a contratação
  // ------------------------------------------------------

  const solicitante = await UserModel.findById(solicitanteId);

  if (!solicitante) {
    const error: any = new Error(
      'Usuário que está realizando a contratação não foi encontrado.'
    );

    error.status = 404;

    throw error;
  }


  // ------------------------------------------------------
  // 2. Buscar o cliente que será contratado
  // ------------------------------------------------------

  const cliente = await UserModel.findById(clienteId);

  if (!cliente) {
    const error: any = new Error(
      'Cliente não encontrado.'
    );

    error.status = 404;

    throw error;
  }


  // ------------------------------------------------------
  // 3. Só CLIENTE pode virar FUNCIONÁRIO
  // ------------------------------------------------------

  if (cliente.perfil !== UserProfile.Cliente) {
    const error: any = new Error(
      'Somente usuários com perfil cliente podem ser contratados como funcionário.'
    );

    error.status = 400;

    throw error;
  }


  // ------------------------------------------------------
  // 4. Descobrir a loja da contratação
  // ------------------------------------------------------

  let lojaId: string;


  // ------------------------------------------------------
  // LOJISTA
  // ------------------------------------------------------

  if (solicitante.perfil === UserProfile.Logista) {

    // O lojista precisa possuir uma loja.

    if (!solicitante.lojaId) {
      const error: any = new Error(
        'O lojista não possui uma loja vinculada.'
      );

      error.status = 400;

      throw error;
    }

    // IMPORTANTE:
    // Ignoramos lojaId enviado pelo Postman.
    // O lojista só pode contratar para a própria loja.

    lojaId = solicitante.lojaId.toString();

  }


  // ------------------------------------------------------
  // ADMIN
  // ------------------------------------------------------

  else if (solicitante.perfil === UserProfile.ADMIN) {

    // Admin precisa informar qual loja receberá
    // o novo funcionário.

    if (!lojaIdInformada) {
      const error: any = new Error(
        'O administrador precisa informar o lojaId.'
      );

      error.status = 400;

      throw error;
    }

    lojaId = lojaIdInformada;

  }


  // ------------------------------------------------------
  // QUALQUER OUTRO PERFIL
  // ------------------------------------------------------

  else {

    const error: any = new Error(
      'Você não possui permissão para contratar funcionários.'
    );

    error.status = 403;

    throw error;
  }


  // ------------------------------------------------------
  // 5. Verificar se a loja existe
  // ------------------------------------------------------

  const loja = await LojaModel.findById(lojaId);

  if (!loja) {
    const error: any = new Error(
      'Loja não encontrada.'
    );

    error.status = 404;

    throw error;
  }


  // ------------------------------------------------------
  // 6. Se for LOJISTA, garantir que a loja pertence a ele
  // ------------------------------------------------------

  if (solicitante.perfil === UserProfile.Logista) {

    const proprietarioId =
      loja.proprietarioId?.toString();

    if (
      proprietarioId !==
      solicitante._id.toString()
    ) {
      const error: any = new Error(
        'Você só pode contratar funcionários para sua própria loja.'
      );

      error.status = 403;

      throw error;
    }
  }


  // ------------------------------------------------------
  // 7. Transformar CLIENTE em FUNCIONÁRIO
  // ------------------------------------------------------

  cliente.perfil = UserProfile.Funcionario;

  cliente.lojaId = loja._id;

  await cliente.save();


  // ------------------------------------------------------
  // 8. Retornar funcionário
  // ------------------------------------------------------

  return cliente;
}



