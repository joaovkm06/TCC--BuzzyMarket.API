export const carrinhoSwagger = {
  '/carrinho/itens': {
    post: {
      tags: ['Carrinho'],
      summary: 'Adicionar produto ao carrinho',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AdicionarItemCarrinho'
            }
          }
        }
      },

      responses: {
        '200': {
          description: 'Produto adicionado ao carrinho'
        },
        '400': {
          description: 'Dados inválidos'
        }
      }
    }
  },

  '/carrinho/usuario/{usuarioId}': {
    get: {
      tags: ['Carrinho'],
      summary: 'Buscar carrinho do usuário',

      parameters: [
        {
          name: 'usuarioId',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        }
      ],

      responses: {
        '200': {
          description: 'Carrinho encontrado'
        },
        '404': {
          description: 'Usuário não encontrado'
        }
      }
    },

    delete: {
      tags: ['Carrinho'],
      summary: 'Limpar carrinho',

      parameters: [
        {
          name: 'usuarioId',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        }
      ],

      responses: {
        '200': {
          description: 'Carrinho limpo com sucesso'
        }
      }
    }
  },

  '/carrinho/usuario/{usuarioId}/itens/{produtoId}': {
    patch: {
      tags: ['Carrinho'],
      summary: 'Atualizar quantidade de um produto',

      parameters: [
        {
          name: 'usuarioId',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        },
        {
          name: 'produtoId',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        }
      ],

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AtualizarQuantidadeCarrinho'
            }
          }
        }
      },

      responses: {
        '200': {
          description: 'Quantidade atualizada'
        },
        '404': {
          description: 'Produto não encontrado no carrinho'
        }
      }
    },

    delete: {
      tags: ['Carrinho'],
      summary: 'Remover produto do carrinho',

      parameters: [
        {
          name: 'usuarioId',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        },
        {
          name: 'produtoId',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        }
      ],

      responses: {
        '200': {
          description: 'Produto removido'
        },
        '404': {
          description: 'Produto não encontrado no carrinho'
        }
      }
    }
  }
};