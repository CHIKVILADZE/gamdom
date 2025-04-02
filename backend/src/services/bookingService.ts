import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { setReservationTimer } from '../utils/timer';
import logger from '../utils/logger';
import { broadcastSeatUpdate } from '../index';

const prisma = new PrismaClient();

const reserveSchema = z.object({
  sessionId: z.number(),
  seatIds: z.array(z.number()),
});

export const reserveSeats = async (userId: number, data: z.infer<typeof reserveSchema>) => {
  const { sessionId, seatIds } = reserveSchema.parse(data);

  const seats = await prisma.seat.findMany({
    where: { id: { in: seatIds }, sessionId, status: 'available' },
  });
  if (seats.length !== seatIds.length) throw new Error('Some seats are not available');

  const expiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  const booking = await prisma.booking.create({
    data: {
      sessionId,
      userId,
      status: 'reserved',
      reservationExpiry: expiry,
      seats: { connect: seatIds.map(id => ({ id })) },
    },
  });

  await prisma.seat.updateMany({
    where: { id: { in: seatIds } },
    data: { status: 'reserved', bookingId: booking.id },
  });

  seatIds.forEach(seatId => broadcastSeatUpdate(sessionId, seatId, 'reserved'));
  setReservationTimer(booking.id, expiry);
  logger.info(`User ${userId} reserved seats ${seatIds} for session ${sessionId}`);

  return booking;
};

export const confirmBooking = async (userId: number, bookingId: number) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId, userId },
    include: { seats: true },
  });
  if (!booking || booking.status !== 'reserved') throw new Error('Invalid booking');
  if (booking.reservationExpiry && new Date() > booking.reservationExpiry) {
    throw new Error('Reservation expired');
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'booked', reservationExpiry: null },
  });

  const seatIds = booking.seats.map(s => s.id);
  await prisma.seat.updateMany({
    where: { id: { in: seatIds } },
    data: { status: 'booked' },
  });

  seatIds.forEach(seatId => broadcastSeatUpdate(booking.sessionId, seatId, 'booked'));
  logger.info(`User ${userId} confirmed booking ${bookingId}`);

  return booking;
};