
import { Request, Response } from 'express';

import * as produtoService from '../service/ProdutoService';
import * as produtoRepository from '../repository/ProdutoRepository';
import * as lojaRepository from '../repository/LojaRepository';

import { AuthRequest } from '../types/AuthRequest';
import { UserProfile } from '../model/usuario';


// ==========================================
// CRIAR PRODUTO
// ==========================================

export async function criarProduto(
  req: AuthRequest,
  res: Response
) {
  try {

    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.'
      });
    }


    const { lojaId } = req.body;


    if (!lojaId) {
      return res.status(400).json({
        mensagem: 'Informe a loja do produto.'
      });
    }


    // ==========================================
    // ADMIN
    // ==========================================

    const ehAdmin =
      req.usuario.perfil === UserProfile.ADMIN;


    // ==========================================
    // LOGISTA
    // ==========================================

    if (!ehAdmin) {

      if (
        req.usuario.perfil !== UserProfile.Logista
      ) {
        return res.status(403).json({
          mensagem:
            'Somente lojistas podem cadastrar produtos.'
        });
      }


      const loja =
        await lojaRepository.buscarLojaPorIdSemPopulate(
          lojaId
        );


      if (!loja) {
        return res.status(404).json({
          mensagem: 'Loja não encontrada.'
        });
      }


      const ehProprietario =
        loja.proprietarioId.toString() ===
        String(req.usuario.id);


      if (!ehProprietario) {
        return res.status(403).json({
          mensagem:
            'Você só pode cadastrar produtos na sua própria loja.'
        });
      }
    }


    const produto =
      await produtoService.criarProduto(
        req.body
      );


    return res.status(201).json({
      mensagem: 'Produto criado com sucesso.',
      produto
    });

  } catch (error: any) {

    console.error(
      'Erro ao criar produto:',
      error
    );

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível criar o produto.'
    });
  }
}


// ==========================================
// LISTAR PRODUTOS
// ==========================================

export async function listarProdutos(
  req: Request,
  res: Response
) {
  try {

    const produtos =
      await produtoService.listarProdutos();


    return res.status(200).json(
      produtos
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar produtos:',
      error
    );

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível buscar os produtos.'
    });
  }
}


// ==========================================
// BUSCAR PRODUTO POR ID
// ==========================================

export async function buscarProdutoPorId(
  req: Request,
  res: Response
) {
  try {

    const id =
      String(req.params.id);


    const produto =
      await produtoService.buscarProdutoPorId(
        id
      );


    return res.status(200).json(
      produto
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar produto:',
      error
    );

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível buscar o produto.'
    });
  }
}


// ==========================================
// LISTAR PRODUTOS DA LOJA
// ==========================================

export async function listarProdutosPorLoja(
  req: Request,
  res: Response
) {
  try {

    const lojaId =
      String(req.params.lojaId);


    const resultado =
      await produtoService.listarProdutosPorLoja(
        lojaId
      );


    return res.status(200).json(
      resultado
    );

  } catch (error: any) {

    console.error(
      'Erro ao buscar produtos da loja:',
      error
    );

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível buscar os produtos da loja.'
    });
  }
}


// ==========================================
// ATUALIZAR PRODUTO
// ==========================================

export async function atualizarProduto(
  req: AuthRequest,
  res: Response
) {
  try {

    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.'
      });
    }


    const id =
      String(req.params.id);


    const produto =
      await produtoRepository.buscarProdutoSemPopulate(
        id
      );


    if (!produto) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado.'
      });
    }


    const ehAdmin =
      req.usuario.perfil === UserProfile.ADMIN;


    if (!ehAdmin) {

      if (
        req.usuario.perfil !== UserProfile.Logista
      ) {
        return res.status(403).json({
          mensagem:
            'Somente lojistas podem atualizar produtos.'
        });
      }


      const loja =
        await lojaRepository.buscarLojaPorIdSemPopulate(
          produto.lojaId.toString()
        );


      if (!loja) {
        return res.status(404).json({
          mensagem:
            'A loja do produto não foi encontrada.'
        });
      }


      const ehProprietario =
        loja.proprietarioId.toString() ===
        String(req.usuario.id);


      if (!ehProprietario) {
        return res.status(403).json({
          mensagem:
            'Você só pode alterar produtos da sua própria loja.'
        });
      }
    }


    // ==========================================
    // NÃO PERMITIR ALTERAÇÃO DO LOJAID
    // ==========================================

    const dadosAtualizacao = {
      ...req.body
    };


    delete dadosAtualizacao.lojaId;


    const produtoAtualizado =
      await produtoService.atualizarProduto(
        id,
        dadosAtualizacao
      );


    return res.status(200).json({
      mensagem:
        'Produto atualizado com sucesso.',
      produto: produtoAtualizado
    });

  } catch (error: any) {

    console.error(
      'Erro ao atualizar produto:',
      error
    );

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível atualizar o produto.'
    });
  }
}


// ==========================================
// ATUALIZAR ESTOQUE
// ==========================================

export async function atualizarEstoque(
  req: AuthRequest,
  res: Response
) {
  try {

    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.'
      });
    }


    const id =
      String(req.params.id);


    const produto =
      await produtoRepository.buscarProdutoSemPopulate(
        id
      );


    if (!produto) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado.'
      });
    }


    const ehAdmin =
      req.usuario.perfil === UserProfile.ADMIN;


    if (!ehAdmin) {

      if (
        req.usuario.perfil !== UserProfile.Logista
      ) {
        return res.status(403).json({
          mensagem:
            'Somente lojistas podem alterar o estoque.'
        });
      }


      const loja =
        await lojaRepository.buscarLojaPorIdSemPopulate(
          produto.lojaId.toString()
        );


      if (!loja) {
        return res.status(404).json({
          mensagem: 'Loja não encontrada.'
        });
      }


      if (
        loja.proprietarioId.toString() !==
        String(req.usuario.id)
      ) {
        return res.status(403).json({
          mensagem:
            'Você só pode alterar o estoque dos produtos da sua loja.'
        });
      }
    }


    const { estoque } =
      req.body;


    const resultado =
      await produtoService.atualizarEstoque(
        id,
        estoque
      );


    return res.status(200).json({
      mensagem:
        'Estoque atualizado com sucesso.',
      produto: resultado
    });

  } catch (error: any) {

    console.error(
      'Erro ao atualizar estoque:',
      error
    );

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível atualizar o estoque.'
    });
  }
}


// ==========================================
// ATIVAR / DESATIVAR PRODUTO
// ==========================================

export async function atualizarAtivo(
  req: AuthRequest,
  res: Response
) {
  try {

    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.'
      });
    }


    const id =
      String(req.params.id);


    const produto =
      await produtoRepository.buscarProdutoSemPopulate(
        id
      );


    if (!produto) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado.'
      });
    }


    const ehAdmin =
      req.usuario.perfil === UserProfile.ADMIN;


    if (!ehAdmin) {

      if (
        req.usuario.perfil !== UserProfile.Logista
      ) {
        return res.status(403).json({
          mensagem:
            'Somente lojistas podem alterar o status do produto.'
        });
      }


      const loja =
        await lojaRepository.buscarLojaPorIdSemPopulate(
          produto.lojaId.toString()
        );


      if (!loja) {
        return res.status(404).json({
          mensagem: 'Loja não encontrada.'
        });
      }


      if (
        loja.proprietarioId.toString() !==
        String(req.usuario.id)
      ) {
        return res.status(403).json({
          mensagem:
            'Você só pode alterar produtos da sua loja.'
        });
      }
    }


    const { ativo } =
      req.body;


    const resultado =
      await produtoService.atualizarAtivo(
        id,
        ativo
      );


    return res.status(200).json({
      mensagem: ativo
        ? 'Produto ativado com sucesso.'
        : 'Produto desativado com sucesso.',
      produto: resultado
    });

  } catch (error: any) {

    console.error(
      'Erro ao alterar status do produto:',
      error
    );

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível alterar o status do produto.'
    });
  }
}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

export async function excluirProduto(
  req: AuthRequest,
  res: Response
) {
  try {

    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.'
      });
    }


    const id =
      String(req.params.id);


    const produto =
      await produtoRepository.buscarProdutoSemPopulate(
        id
      );


    if (!produto) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado.'
      });
    }


    const ehAdmin =
      req.usuario.perfil === UserProfile.ADMIN;


    if (!ehAdmin) {

      if (
        req.usuario.perfil !== UserProfile.Logista
      ) {
        return res.status(403).json({
          mensagem:
            'Somente lojistas podem excluir produtos.'
        });
      }


      const loja =
        await lojaRepository.buscarLojaPorIdSemPopulate(
          produto.lojaId.toString()
        );


      if (!loja) {
        return res.status(404).json({
          mensagem: 'Loja não encontrada.'
        });
      }


      if (
        loja.proprietarioId.toString() !==
        String(req.usuario.id)
      ) {
        return res.status(403).json({
          mensagem:
            'Você só pode excluir produtos da sua própria loja.'
        });
      }
    }


    await produtoService.excluirProduto(
      id
    );


    return res.status(200).json({
      mensagem:
        'Produto excluído com sucesso.'
    });

  } catch (error: any) {

    console.error(
      'Erro ao excluir produto:',
      error
    );

    return res.status(error.status || 500).json({
      mensagem:
        error.message ||
        'Não foi possível excluir o produto.'
    });
  }
}

