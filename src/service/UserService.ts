import {
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
    senhaHash,
    perfil,
    endereco,
    lojaId
  } = dados;


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


    // Verifica se a loja já possui outro proprietário
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
    senhaHash,
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


      // ==================================================
      // VERIFICAR PROPRIETÁRIO
      // ==================================================

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
  // ATUALIZAR USUÁRIO
  // ====================================================

  return await userRepository.atualizarUsuario(
    id,
    {
      nome,
      email,
      senhaHash,
      perfil: perfilAtualizado,
      endereco,
      lojaId: lojaParaSalvar
    }
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