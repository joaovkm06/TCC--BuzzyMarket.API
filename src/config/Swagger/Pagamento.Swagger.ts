export const pagamentoSwagger = {
  '/pagamentos': {
    get: {
      tags: ['Pagamentos'],
      summary: 'Listar pagamentos',

      responses: {
        '200': {
          description: 'Lista de pagamentos'
        }
      }
    },

    post: {
      tags: ['Pagamentos'],
      summary: 'Criar pagamento',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CriarPagamento'
            }
          }
        }
      },

      responses: {
        '201': {
          description: 'Pagamento criado com sucesso'
        },
        '400': {
          description: 'Dados inválidos'
        }
      }
    }
  },

  '/pagamentos/{id}': {
    get: {
      tags: ['Pagamentos'],
      summary: 'Buscar pagamento por ID',

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
          description: 'Pagamento encontrado'
        },
        '404': {
          description: 'Pagamento não encontrado'
        }
      }
    },

    put: {
      tags: ['Pagamentos'],
      summary: 'Atualizar pagamento',

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
              $ref: '#/components/schemas/AtualizarPagamento'
            }
          }
        }
      },

      responses: {
        '200': {
          description: 'Pagamento atualizado'
        }
      }
    }
  }
};