import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllAdminData,
  getVilla,
  updateVilla,
  listBookings,
  updateBooking,
  deleteBooking,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listReviews,
  updateReview,
  deleteReview,
} from '../controllers/dataController.js';

const router = express.Router();

router.use(protect);

router.get('/data', getAllAdminData);
router.get('/villa', getVilla);
router.put('/villa', updateVilla);
router.get('/bookings', listBookings);
router.patch('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);
router.get('/users', listUsers);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/reviews', listReviews);
router.patch('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

export default router;
