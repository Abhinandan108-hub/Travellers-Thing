import { Router } from 'express';
import {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getDestinations);
router.get('/:id', getDestination);
router.post('/', protect, adminOnly, createDestination);
router.put('/:id', protect, adminOnly, updateDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);

export default router;