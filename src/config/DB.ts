import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

const env = {
  port: process.env.PORT || '6767',

  mongoUri: process.env.MONGO_URI || ''
};

if (!env.mongoUri) {
  throw new Error(
    'MONGO_URI nao foi configurada no arquivo .env'
  );
}

export default env;