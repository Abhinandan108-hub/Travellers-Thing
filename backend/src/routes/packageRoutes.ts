import { Router } from 'express';
import {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getPackages);
router.get('/:id', getPackage);
router.post('/', protect, adminOnly, createPackage);
router.put('/:id', protect, adminOnly, updatePackage);
router.delete('/:id', protect, adminOnly, deletePackage);

export default router;