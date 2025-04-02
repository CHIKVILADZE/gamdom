import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/sessions/:id/reserve', authMiddleware, bookingController.reserveSeats);
router.post('/bookings/:bookingId/confirm', authMiddleware, bookingController.confirmBooking);

export default router;