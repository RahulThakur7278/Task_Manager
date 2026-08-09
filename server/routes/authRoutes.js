import express from 'express';
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
  registerSchema,
  loginSchema,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken);
router.get('/me', authMiddleware, getMe);

export default router;
