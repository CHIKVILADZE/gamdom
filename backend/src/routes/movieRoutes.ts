import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getAllMovies, getMovieById } from '../controllers/movieController'; 

const router = Router();

router.get('/', authMiddleware, getAllMovies);
router.get('/:id', authMiddleware, getMovieById);

export default router;