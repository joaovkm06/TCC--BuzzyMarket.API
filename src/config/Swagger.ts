
import swaggerUi from 'swagger-ui-express';

import { userSwagger } from './Swagger/User.Swagger';
import { lojaSwagger } from './Swagger/loja.Swagger';
import { produtoSwagger } from './Swagger/Produto.Swagger';
import { carrinhoSwagger } from './Swagger/Carrinho.Swagger';
import { pedidoSwagger } from './Swagger/Pedido.Swagger';
import { pagamentoSwagger } from './Swagger/Pagamento.Swagger';
import { notificacaoSwagger } from './Swagger/Notificaçao.Swagger';

export { swaggerUi };

export const swaggerDocument = {
  openapi: '3.0.0',

  info: {
    title: 'BuzzyMarket API',
    version: '1.0.0',
    description: 'API do marketplace BuzzyMarket'
  },

  servers: [
    {
      url: 'http://localhost:6767',
      description: 'Servidor local'
    }
  ],

  tags: [
    {
      name: 'Users',
      description: 'Gerenciamento de usuários'
    },
    {
      name: 'Lojas',
      description: 'Gerenciamento de lojas'
    },
    {
      name: 'Produtos',
      description: 'Gerenciamento de produtos'
    },
    {
      name: 'Carrinho',
      description: 'Gerenciamento do carrinho'
    },
    {
      name: 'Pedidos',
      description: 'Gerenciamento de pedidos'
    },
    {
      name: 'Pagamentos',
      description: 'Gerenciamento de pagamentos'
    },
    {
      name: 'Notificações',
      description: 'Gerenciamento de notificações'
    }
  ],

  paths: {
    ...userSwagger,
    ...lojaSwagger,
    ...produtoSwagger,
    ...carrinhoSwagger,
    ...pedidoSwagger,
    ...pagamentoSwagger,
    ...notificacaoSwagger
  },

  components: {
    schemas: {
      CriarUsuario: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'perfil'],
        properties: {
          nome: {
            type: 'string',
            example: 'João'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'joao@email.com'
          },
          senha: {
            type: 'string',
            format: 'password',
            example: '123456'
          },
          perfil: {
            type: 'string',
            enum: ['cliente', 'funcionario', 'logista', 'admin'],
            example: 'cliente'
          }
        }
      },

      AtualizarUsuario: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            example: 'João Silva'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'joao@email.com'
          },
          senha: {
            type: 'string',
            format: 'password',
            example: '123456'
          },
          perfil: {
            type: 'string',
            enum: ['cliente', 'funcionario', 'logista', 'admin'],
            example: 'cliente'
          }
        }
      },

      CriarLoja: {
        type: 'object'
      },

      AtualizarLoja: {
        type: 'object'
      },

      CriarProduto: {
        type: 'object'
      },

      AtualizarProduto: {
        type: 'object'
      },

      AdicionarItemCarrinho: {
        type: 'object'
      },

      AtualizarQuantidadeCarrinho: {
        type: 'object'
      },

      CriarPedido: {
        type: 'object'
      },

      AtualizarStatusPedido: {
        type: 'object'
      },

      CriarPagamento: {
        type: 'object'
      },

      AtualizarPagamento: {
        type: 'object'
      },

      CriarNotificacao: {
        type: 'object'
      }
    }
  }
};

