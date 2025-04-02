import { Router } from 'express';
import * as sessionController from '../controllers/sessionController';
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', authMiddleware, sessionController.createSession);
router.get('/', sessionController.getSessions);
router.get('/:id', sessionController.getSessionById);

export default router;