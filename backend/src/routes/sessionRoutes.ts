import {  Router } from 'express';
import * as sessionController from '../controllers/sessionController';
import * as bookingController from '../controllers/bookingController';

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', authMiddleware, sessionController.createSession);
router.post('/:id/reserve', authMiddleware, bookingController.reserveSeats);
router.get('/', sessionController.getSessions);
router.get('/:id', sessionController.getSessionById);
export default router;