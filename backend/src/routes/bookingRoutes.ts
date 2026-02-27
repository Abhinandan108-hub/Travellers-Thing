import { Router } from 'express';
import {
  getMyBookings,
  getAllBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;