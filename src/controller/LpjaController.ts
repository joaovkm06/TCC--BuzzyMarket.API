import { Request, Response } from 'express';
import * as lojaService from '../service/LojaService';

export async function criarLoja(req: Request, res: Response) {
  try {
    const loja = await lojaService.criarLoja(req.body);

    return res.status(201).json({
      mensagem: 'Loja criada com sucesso.',
      loja
    });

  } catch (error: any) {
    console.error('Erro ao criar loja:', error);

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro interno ao criar loja.'
    });
  }
}


export async function listarLojas(req: Request, res: Response) {
  try {
    const lojas = await lojaService.listarLojas();

    return res.status(200).json(lojas);

  } catch (error: any) {
    console.error('Erro ao buscar lojas:', error);

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro interno ao buscar lojas.'
    });
  }
}


export async function buscarLojaPorId(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const loja = await lojaService.buscarLojaPorId(id);

    return res.status(200).json(loja);

  } catch (error: any) {
    console.error('Erro ao buscar loja:', error);

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro interno ao buscar loja.'
    });
  }
}


export async function atualizarLoja(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const loja = await lojaService.atualizarLoja(
      id,
      req.body
    );

    return res.status(200).json({
      mensagem: 'Loja atualizada com sucesso.',
      loja
    });

  } catch (error: any) {
    console.error('Erro ao atualizar loja:', error);

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro interno ao atualizar loja.'
    });
  }
}


export async function atualizarHorarios(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const { horarios } = req.body;

    const loja = await lojaService.atualizarHorarios(
      id,
      horarios
    );

    return res.status(200).json({
      mensagem: 'Horários da loja atualizados com sucesso.',
      horarios: loja.horarios
    });

  } catch (error: any) {
    console.error('Erro ao atualizar horários:', error);

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro interno ao atualizar horários.'
    });
  }
}


export async function atualizarStatusLoja(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const { status } = req.body;

    const loja = await lojaService.atualizarStatusLoja(
      id,
      status
    );

    return res.status(200).json({
      mensagem: 'Status da loja atualizado com sucesso.',
      status: loja.status
    });

  } catch (error: any) {
    console.error('Erro ao atualizar status:', error);

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro interno ao atualizar status.'
    });
  }
}


export async function verificarLojaAberta(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const resultado = await lojaService.verificarLojaAberta(id);

    return res.status(200).json(resultado);

  } catch (error: any) {
    console.error('Erro ao verificar funcionamento:', error);

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro interno ao verificar funcionamento da loja.'
    });
  }
}


export async function excluirLoja(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    await lojaService.excluirLoja(id);

    return res.status(200).json({
      mensagem: 'Loja excluída com sucesso.'
    });

  } catch (error: any) {
    console.error('Erro ao excluir loja:', error);

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro interno ao excluir loja.'
    });
  }
}