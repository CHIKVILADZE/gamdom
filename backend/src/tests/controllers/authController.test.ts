import { signup, signin } from '../../controllers/authController';
import * as authService from '../../services/authService';
import httpMocks from 'node-mocks-http';

jest.mock('../../services/authService');

describe('authController', () => {
  describe('signup', () => {
    it('should return 201 and user on successful signup', async () => {
      const mockUser = { id: 1, email: 'test@example.com', fullName: 'Test User' };
      (authService.signup as jest.Mock).mockResolvedValue(mockUser);

      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User',
        },
      });
      const res = httpMocks.createResponse();

      await signup(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockUser);
      expect(authService.signup).toHaveBeenCalled();
    });

    it('should return 400 with validation errors for invalid input', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          email: 'invalid',
          password: '123',
          fullName: '',
        },
      });
      const res = httpMocks.createResponse();

      await signup(req, res);

      expect(res.statusCode).toBe(400);

      const data = res._getJSONData();

      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('message');
      expect(data[0]).toHaveProperty('path');
    });
  });

  describe('signin', () => {
    it('should return 200 and token on successful signin', async () => {
      (authService.signin as jest.Mock).mockResolvedValue({ token: 'jwt-token' });

      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = httpMocks.createResponse();

      await signin(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ token: 'jwt-token' });
      expect(authService.signin).toHaveBeenCalled();
    });

    it('should return 401 on signin failure', async () => {
      (authService.signin as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid credentials');
      });

      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'wrongpass',
        },
      });
      const res = httpMocks.createResponse();

      await signin(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toHaveProperty('message', 'Invalid credentials');
    });
  });
});
