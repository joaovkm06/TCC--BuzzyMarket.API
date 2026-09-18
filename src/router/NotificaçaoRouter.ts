
import { Router } from 'express';

import {
  criarNotificacao,
  listarNotificacoes,
  listarNotificacoesPorUsuario,
  buscarNotificacaoPorId,
  atualizarLeitura,
  marcarTodasComoLidas,
  excluirNotificacao
} from '../controller/NotificaçaoController';

import { autenticar } from '../middleware/AuthMiddleware';
import { permitirPerfis } from '../middleware/RoleMiddleware';
import { asyncHandler } from '../middleware/AsyncHandler';
import { UserProfile } from '../model/usuario';

const router = Router();

// =====================================================
// CRIAR NOTIFICAÇÃO
// =====================================================

// Admin, lojista e funcionário podem enviar
// notificações para usuários.
router.post(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.ADMIN,
    UserProfile.Logista,
    UserProfile.Funcionario
  ),
  asyncHandler(criarNotificacao)
);

// =====================================================
// LISTAR TODAS
// =====================================================

// Apenas administrador pode visualizar
// todas as notificações da plataforma.
router.get(
  '/',
  autenticar,
  permitirPerfis(
    UserProfile.ADMIN
  ),
  asyncHandler(listarNotificacoes)
);

// =====================================================
// LISTAR MINHAS NOTIFICAÇÕES
// =====================================================

// O usuário é identificado pelo JWT.
// Não usamos /usuario/:usuarioId.
router.get(
  '/usuario',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Funcionario,
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(listarNotificacoesPorUsuario)
);

// =====================================================
// MARCAR TODAS COMO LIDAS
// =====================================================

// O usuário é identificado pelo JWT.
router.patch(
  '/usuario/lidas',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Funcionario,
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(marcarTodasComoLidas)
);

// =====================================================
// BUSCAR POR ID
// =====================================================

router.get(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Funcionario,
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(buscarNotificacaoPorId)
);

// =====================================================
// MARCAR COMO LIDA / NÃO LIDA
// =====================================================

router.patch(
  '/:id/lida',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Funcionario,
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(atualizarLeitura)
);

// =====================================================
// EXCLUIR
// =====================================================

router.delete(
  '/:id',
  autenticar,
  permitirPerfis(
    UserProfile.Cliente,
    UserProfile.Funcionario,
    UserProfile.Logista,
    UserProfile.ADMIN
  ),
  asyncHandler(excluirNotificacao)
);

export default router;

