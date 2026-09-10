export const pedidoSwagger = {
  '/pedidos': {
    get: {
      tags: ['Pedidos'],
      summary: 'Listar todos os pedidos',

      responses: {
        '200': {
          description: 'Lista de pedidos'
        }
      }
    },

    post: {
      tags: ['Pedidos'],
      summary: 'Criar pedido',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CriarPedido'
            }
          }
        }
      },

      responses: {
        '201': {
          description: 'Pedido criado com sucesso'
        },
        '400': {
          description: 'Dados inválidos'
        }
      }
    }
  },

  '/pedidos/{id}': {
    get: {
      tags: ['Pedidos'],
      summary: 'Buscar pedido por ID',

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
          description: 'Pedido encontrado'
        },
        '404': {
          description: 'Pedido não encontrado'
        }
      }
    },

    put: {
      tags: ['Pedidos'],
      summary: 'Atualizar status do pedido',

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
              $ref: '#/components/schemas/AtualizarStatusPedido'
            }
          }
        }
      },

      responses: {
        '200': {
          description: 'Pedido atualizado'
        }
      }
    }
  }
};