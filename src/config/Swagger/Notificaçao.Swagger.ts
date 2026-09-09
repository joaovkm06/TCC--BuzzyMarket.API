export const notificacaoSwagger = {
  '/notificacoes': {
    get: {
      tags: ['Notificações'],
      summary: 'Listar notificações',

      responses: {
        '200': {
          description: 'Lista de notificações'
        }
      }
    },

    post: {
      tags: ['Notificações'],
      summary: 'Criar notificação',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CriarNotificacao'
            }
          }
        }
      },

      responses: {
        '201': {
          description: 'Notificação criada com sucesso'
        }
      }
    }
  },

  '/notificacoes/{id}': {
    get: {
      tags: ['Notificações'],
      summary: 'Buscar notificação por ID',

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
          description: 'Notificação encontrada'
        },
        '404': {
          description: 'Notificação não encontrada'
        }
      }
    },

    delete: {
      tags: ['Notificações'],
      summary: 'Excluir notificação',

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
          description: 'Notificação excluída'
        }
      }
    }
  },

  '/notificacoes/usuario/{usuarioId}': {
    get: {
      tags: ['Notificações'],
      summary: 'Listar notificações de um usuário',

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
          description: 'Notificações do usuário'
        }
      }
    }
  }
};