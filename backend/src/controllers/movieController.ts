import { Request, Response } from 'express';
import { Movie } from '../../../shared/interface/interfaces';
import movieService from '../services/moviesService'; 

export const getAllMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies: Movie[] = await movieService.getAllMovies();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.id);
    if (isNaN(movieId)) {
      res.status(400).json({ error: 'Invalid movie ID' });
      return;
    }
    const movie: Movie | null = await movieService.getMovieById(movieId);
    if (!movie) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch movie with id ${req.params.id}` });
  }
};