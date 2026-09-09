
export const userSwagger = {
  '/users': {
    get: {
      tags: ['Users'],
      summary: 'Listar todos os usuários',

      responses: {
        '200': {
          description: 'Lista de usuários'
        },

        '500': {
          description: 'Erro interno do servidor'
        }
      }
    },

    post: {
      tags: ['Users'],
      summary: 'Cadastrar um novo usuário',

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CriarUsuario'
            },

            example: {
              nome: 'João',
              email: 'joao@email.com',
              senha: '123456',
              perfil: 'cliente'
            }
          }
        }
      },

      responses: {
        '201': {
          description: 'Usuário criado com sucesso'
        },

        '400': {
          description: 'Dados inválidos'
        },

        '500': {
          description: 'Erro interno do servidor'
        }
      }
    }
  },

  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Buscar usuário por ID',

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,

          description: 'ID do usuário',

          schema: {
            type: 'string',
            example: '64f123456789abcdef123456'
          }
        }
      ],

      responses: {
        '200': {
          description: 'Usuário encontrado'
        },

        '404': {
          description: 'Usuário não encontrado'
        },

        '500': {
          description: 'Erro interno do servidor'
        }
      }
    },

    put: {
      tags: ['Users'],
      summary: 'Atualizar usuário',

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,

          description: 'ID do usuário',

          schema: {
            type: 'string',
            example: '64f123456789abcdef123456'
          }
        }
      ],

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AtualizarUsuario'
            },

            example: {
              nome: 'João Silva',
              email: 'joaosilva@email.com',
              senha: '123456'
            }
          }
        }
      },

      responses: {
        '200': {
          description: 'Usuário atualizado com sucesso'
        },

        '400': {
          description: 'Dados inválidos'
        },

        '404': {
          description: 'Usuário não encontrado'
        },

        '500': {
          description: 'Erro interno do servidor'
        }
      }
    },

    delete: {
      tags: ['Users'],
      summary: 'Excluir usuário',

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,

          description: 'ID do usuário',

          schema: {
            type: 'string',
            example: '64f123456789abcdef123456'
          }
        }
      ],

      responses: {
        '200': {
          description: 'Usuário excluído com sucesso'
        },

        '404': {
          description: 'Usuário não encontrado'
        },

        '500': {
          description: 'Erro interno do servidor'
        }
      }
    }
  }
};

