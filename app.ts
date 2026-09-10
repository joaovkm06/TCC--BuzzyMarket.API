import express from 'express';

import userRouter from './src/router/UserRoutes';
import lojaRouter from './src/router/lojaRouter';
import produtoRouter from './src/router/ProdutoRouter';
import pedidoRouter from './src/router/PedidoRouter';
import notificacaoRouter from './src/router/NotificaçaoRouter';
import pagamentoRouter from './src/router/PagamentoRouter';
import carrinhoRouter from './src/router/CarrinhoRouter';
import authRouter from './src/auth/AuthRouter';

import { swaggerDocument, swaggerUi } from './src/config/Swagger';

const app = express();

app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get('/', (req, res) => {
  res.json({
    mensagem: 'BuzzyMarket API funcionando!'
  });
});

app.use('/users', userRouter);
app.use('/lojas', lojaRouter);
app.use('/produtos', produtoRouter);
app.use('/carrinho', carrinhoRouter);
app.use('/pedidos', pedidoRouter);
app.use('/notificacoes', notificacaoRouter);
app.use('/pagamentos', pagamentoRouter);
app.use('/auth', authRouter);

export default app;