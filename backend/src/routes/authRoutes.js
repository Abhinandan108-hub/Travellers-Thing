import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
} from "../controllers/authController.js";
import { protect, adminOnly } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/users', protect, adminOnly, getAllUsers);
export default router;
