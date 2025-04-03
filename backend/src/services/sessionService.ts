import { z } from 'zod';
import { sessionSchema } from '@shared/schema/schemas';
import prisma from '../prisma/prisma'



export const createSession = async (data: z.infer<typeof sessionSchema>) => {
  const { movieId, startTime, totalRows, seatsPerRow } = sessionSchema.parse(data);
  const session = await prisma.session.create({
    data: {
      movieId,
      startTime: new Date(startTime),
      totalRows,
      seatsPerRow,
    },
  });

  const seats = [];
  for (let row = 1; row <= totalRows; row++) {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      seats.push({ sessionId: session.id, row, seatNumber: seatNum, status: 'available' });
    }
  }
  await prisma.seat.createMany({ data: seats });

  return session;
};

export const getSessions = async () => {
  return await prisma.session.findMany({ include: { movie: true } });
};

export const getSessionById = async (id: number) => {
  return await prisma.session.findUnique({
    where: { id },
    include: { seats: true, movie: true },
  });
};