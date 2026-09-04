import mongoose from 'mongoose';
import env from './DB';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);

    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('Nao foi possivel conectar ao MongoDB:', error);
    throw error;
  }
}