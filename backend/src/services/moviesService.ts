import { Movie } from '../../../shared/interface/interfaces';
import prisma from '../prisma/prisma';


class MovieService {
  async getAllMovies(): Promise<Movie[]> {
    try {
      const movies = await prisma.movie.findMany({
        orderBy: { id: 'asc' },
      });
      return movies;
    } catch (error) {
      throw new Error('Failed to fetch movies from the database');
    }
  }

  async getMovieById(id: number): Promise<Movie | null> {
    try {
      const movie = await prisma.movie.findUnique({
        where: { id },
        include: { sessions: true }, 
      });
      return movie;
    } catch (error) {
      throw new Error(`Failed to fetch movie with id ${id}`);
    }
  }
}

export default new MovieService();