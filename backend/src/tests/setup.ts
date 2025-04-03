import { prismaMock } from './mocks/prismaClientMock';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));