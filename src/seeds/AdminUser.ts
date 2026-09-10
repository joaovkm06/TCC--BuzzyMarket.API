import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { UserModel, UserProfile } from '../model/usuario';

async function criarAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI não configurado no .env');
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB conectado.');

    const email = 'admin@.com';
    const senha = 'Admin@123456';

    const adminExistente = await UserModel.findOne({ email });

    if (adminExistente) {
      console.log('⚠️ Esse administrador já existe.');
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const admin = await UserModel.create({
      nome: 'Administrador',
      email,
      senhaHash,
      perfil: UserProfile.ADMIN
    });

    console.log('=================================');
    console.log('✅ ADMIN CRIADO COM SUCESSO');
    console.log('=================================');
    console.log('ID:', admin._id.toString());
    console.log('Nome:', admin.nome);
    console.log('Email:', admin.email);
    console.log('Senha:', senha);
    console.log('Perfil:', admin.perfil);
    console.log('=================================');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

criarAdmin();