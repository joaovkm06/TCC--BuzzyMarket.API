export const lojaSwagger = {
  '/lojas': {
    get: {
      tags: ['Lojas'],
      summary: 'Listar todas as lojas',
      responses: {
        '200': {
          description: 'Lista de lojas'
        },
        '500': {
          description: 'Erro interno do servidor'
        }
      }
    },

    post: {
      tags: ['Lojas'],
      summary: 'Criar uma nova loja',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CriarLoja'
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'Loja criada com sucesso'
        },
        '400': {
          description: 'Dados inválidos'
        }
      }
    }
  },

  '/lojas/{id}': {
    get: {
      tags: ['Lojas'],
      summary: 'Buscar loja por ID',

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
          description: 'Loja encontrada'
        },
        '404': {
          description: 'Loja não encontrada'
        }
      }
    },

    put: {
      tags: ['Lojas'],
      summary: 'Atualizar loja',

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
              $ref: '#/components/schemas/AtualizarLoja'
            }
          }
        }
      },

      responses: {
        '200': {
          description: 'Loja atualizada com sucesso'
        },
        '404': {
          description: 'Loja não encontrada'
        }
      }
    },

    delete: {
      tags: ['Lojas'],
      summary: 'Excluir loja',

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
          description: 'Loja excluída com sucesso'
        },
        '404': {
          description: 'Loja não encontrada'
        }
      }
    }
  }
};