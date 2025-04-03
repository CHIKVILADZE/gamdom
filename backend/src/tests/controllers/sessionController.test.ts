import httpMocks from 'node-mocks-http';
import * as sessionService from '../../services/sessionService';
import {
  createSession,
  getSessions,
  getSessionById,
} from '../../controllers/sessionController';

jest.mock('../../services/sessionService');

describe('sessionController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should return 201 and created session on success', async () => {
      const mockSession = { id: 1, movieId: 1 };
      (sessionService.createSession as jest.Mock).mockResolvedValue(mockSession);

      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          movieId: 1,
          startTime: new Date().toISOString(),
          totalRows: 5,
          seatsPerRow: 10,
        },
      });
      const res = httpMocks.createResponse();

      await createSession(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockSession);
      expect(sessionService.createSession).toHaveBeenCalledWith(req.body);
    });

    it('should return 400 on validation or service error', async () => {
      (sessionService.createSession as jest.Mock).mockRejectedValue(new Error('Invalid input'));

      const req = httpMocks.createRequest({
        method: 'POST',
        body: {},
      });
      const res = httpMocks.createResponse();

      await createSession(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Invalid input' });
    });
  });

  describe('getSessions', () => {
    it('should return 200 and sessions list', async () => {
      const mockSessions = [{ id: 1, movieId: 1 }, { id: 2, movieId: 2 }];
      (sessionService.getSessions as jest.Mock).mockResolvedValue(mockSessions);

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getSessions(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockSessions);
      expect(sessionService.getSessions).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      (sessionService.getSessions as jest.Mock).mockRejectedValue(new Error('DB error'));

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getSessions(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'DB error' });
    });
  });

  describe('getSessionById', () => {
    it('should return 200 and session by ID', async () => {
      const mockSession = { id: 1, movieId: 1, seats: [] };
      (sessionService.getSessionById as jest.Mock).mockResolvedValue(mockSession);

      const req = httpMocks.createRequest({
        params: { id: '1' },
      });
      const res = httpMocks.createResponse();

      await getSessionById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockSession);
      expect(sessionService.getSessionById).toHaveBeenCalledWith(1);
    });

    it('should return 404 if session not found', async () => {
      (sessionService.getSessionById as jest.Mock).mockResolvedValue(null);

      const req = httpMocks.createRequest({
        params: { id: '999' },
      });
      const res = httpMocks.createResponse();

      await getSessionById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: 'Session not found' });
    });

    it('should return 500 on service error', async () => {
      (sessionService.getSessionById as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      const req = httpMocks.createRequest({
        params: { id: '2' },
      });
      const res = httpMocks.createResponse();

      await getSessionById(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Unexpected error' });
    });
  });
});
