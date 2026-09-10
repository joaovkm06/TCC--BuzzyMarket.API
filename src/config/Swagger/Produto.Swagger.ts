

export const produtoSwagger = {
  '/produtos': {
    get: {
      tags: ['Produtos'],
      summary: 'Listar todos os produtos',

      responses: {
        '200': {
          description: 'Lista de produtos'
        },
        '500': {
          description: 'Erro interno do servidor'
        }
      }
    },

    post: {
      tags: ['Produtos'],
      summary: 'Cadastrar produto',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CriarProduto'
            }
          }
        }
      },

      responses: {
        '201': {
          description: 'Produto criado com sucesso'
        },
        '400': {
          description: 'Dados inválidos'
        }
      }
    }
  },

  '/produtos/{id}': {
    get: {
      tags: ['Produtos'],
      summary: 'Buscar produto por ID',

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        }
      ],

      responses: {
        '200': {
          description: 'Produto encontrado'
        },
        '404': {
          description: 'Produto não encontrado'
        }
      }
    },

    put: {
      tags: ['Produtos'],
      summary: 'Atualizar produto',

      parameters: [
        {
          name: 'id',
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
              $ref: '#/components/schemas/AtualizarProduto'
            }
          }
        }
      },

      responses: {
        '200': {
          description: 'Produto atualizado com sucesso'
        },
        '404': {
          description: 'Produto não encontrado'
        }
      }
    },

    delete: {
      tags: ['Produtos'],
      summary: 'Excluir produto',

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        }
      ],

      responses: {
        '200': {
          description: 'Produto excluído com sucesso'
        },
        '404': {
          description: 'Produto não encontrado'
        }
      }
    }
  },

  '/produtos/loja/{lojaId}': {
    get: {
      tags: ['Produtos'],
      summary: 'Listar produtos de uma loja',

      parameters: [
        {
          name: 'lojaId',
          in: 'path',
          required: true,

          schema: {
            type: 'string'
          }
        }
      ],

      responses: {
        '200': {
          description: 'Produtos da loja'
        },
        '404': {
          description: 'Loja não encontrada'
        }
      }
    }
  }
};