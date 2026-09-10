import mongoose from 'mongoose';
import app from './app';
import env from './src/config/DB';

async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);

    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error(
      'Nao foi possivel conectar ao MongoDB:',
      error
    );

    throw error;
  }
}

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`Servidor rodando na porta ${env.port}`);
    });
  } catch (error) {
    console.error(
      'Nao foi possivel iniciar o servidor:',
      error
    );

    process.exit(1);
  }
}

startServer();