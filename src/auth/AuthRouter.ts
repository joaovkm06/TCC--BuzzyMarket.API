
import { Router } from 'express';
import { fazerLogin } from './AuthController';

const router = Router();

// Login
router.post('/login', fazerLogin);

export default router;
