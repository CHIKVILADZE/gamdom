import { signup, signin } from '../../services/authService';
import { prismaMock } from '../mocks/prismaClientMock';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signupSchema, signinSchema } from '@shared/schema/schemas';
import { userMock } from '../mocks/authMocks';

process.env.JWT_SECRET = 'test-secret'; 



jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authService', () => {
  describe('signup', () => {
    it('should hash the password and create a new user', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      prismaMock.user.create.mockResolvedValue(userMock);

      const data = signupSchema.parse({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      
      });

      const result = await signup(data, prismaMock);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          fullName: 'Test User',
        },
      });

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
      });
    });
  });

  describe('signin', () => {
    it('should validate user and return token', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwt-token');

      prismaMock.user.findUnique.mockResolvedValue(userMock);

      const data = signinSchema.parse({
        email: 'test@example.com',
        password: 'password123',
      });

      const result = await signin(data, prismaMock);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, 'test-secret', { expiresIn: '1h' });

      expect(result).toEqual({ token: 'jwt-token' });
    });

    it('should throw error if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        signin({ email: 'notfound@example.com', password: 'password123' }, prismaMock)
      ).rejects.toThrow('User not found');
    });

    it('should throw error if password invalid', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        signin({ email: 'test@example.com', password: 'wrongpassword' }, prismaMock)
      ).rejects.toThrow('Invalid password');
    });
  });
});
