import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'BuzzyMarket API funcionando!'
  });
});

export default app;