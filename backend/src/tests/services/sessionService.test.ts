import { createSession, getSessions, getSessionById } from '../../services/sessionService';
import { prismaMock } from '../mocks/prismaClientMock';


describe('sessionService', () => {
  const sessionId = 1;

  describe('createSession', () => {
    it('should create a session and generate seats', async () => {
      const sessionData = {
        movieId: 10,
        startTime: new Date().toISOString(),
        totalRows: 2,
        seatsPerRow: 3,
      };

      const mockSession = {
        id: sessionId,
        ...sessionData,
        startTime: new Date(sessionData.startTime),
      };

      prismaMock.session.create.mockResolvedValue(mockSession);
      prismaMock.seat.createMany.mockResolvedValue({ count: 6 });

      const result = await createSession(sessionData);

      expect(prismaMock.session.create).toHaveBeenCalledWith({
        data: {
          movieId: sessionData.movieId,
          startTime: new Date(sessionData.startTime),
          totalRows: sessionData.totalRows,
          seatsPerRow: sessionData.seatsPerRow,
        },
      });

      expect(prismaMock.seat.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ sessionId, row: 1, seatNumber: 1, status: 'available' }),
        ]),
      });

      expect(result).toEqual(mockSession);
    });
  });

  describe('getSessions', () => {
    it('should return a list of sessions with movie info', async () => {
      const mockSessions = [
        { id: 1, movieId: 1, movie: { title: 'Test Movie' } },
      ];

      prismaMock.session.findMany.mockResolvedValue(mockSessions as any);

      const result = await getSessions();

      expect(prismaMock.session.findMany).toHaveBeenCalledWith({ include: { movie: true } });
      expect(result).toEqual(mockSessions);
    });
  });

  describe('getSessionById', () => {
    it('should return a session with seats and movie info', async () => {
      const mockSession = {
        id: sessionId,
        movieId: 10,
        movie: { title: 'Another Movie' },
        seats: [{ id: 1, row: 1, seatNumber: 1 }],
      };

      prismaMock.session.findUnique.mockResolvedValue(mockSession as any);

      const result = await getSessionById(sessionId);

      expect(prismaMock.session.findUnique).toHaveBeenCalledWith({
        where: { id: sessionId },
        include: { seats: true, movie: true },
      });

      expect(result).toEqual(mockSession);
    });
  });
});
