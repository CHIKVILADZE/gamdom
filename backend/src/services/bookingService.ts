import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { setReservationTimer } from '../utils/timer';
import logger from '../utils/logger';
import { broadcastSeatUpdate } from '../index';
import { reserveSchema } from '../../../shared/schema/schemas';
import { RESERVATION_TIMEOUT_MS, SeatStatus } from '../../../shared/constants/constants';
import { Booking } from '../../../shared/interface/interfaces';

export const createBookingService = (prisma: PrismaClient) => {
  const reserveSeats = async (
    userId: number,
    data: z.infer<typeof reserveSchema>
  ): Promise<Booking> => {
    const { sessionId, seatIds } = reserveSchema.parse(data);
    const expiry = new Date(Date.now() + RESERVATION_TIMEOUT_MS);

    return await prisma.$transaction(async (tx) => {
      const seats = await tx.seat.findMany({
        where: { id: { in: seatIds }, sessionId, status: 'available' },
      });

      if (seats.length !== seatIds.length) {
        throw new Error('Some seats are not available');
      }

      const booking = await tx.booking.create({
        data: {
          sessionId,
          userId,
          status: 'reserved',
          reservationExpiry: expiry,
          seats: { connect: seatIds.map(id => ({ id })) },
        },
        include: { seats: true },
      });

      await tx.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: 'reserved' },
      });

      seatIds.forEach(seatId => broadcastSeatUpdate(sessionId, seatId, 'reserved'));
      setReservationTimer(booking.id, expiry);
      logger.info(`User ${userId} reserved seats ${seatIds}`);

      return {
        ...booking,
        status: booking.status as SeatStatus,
        seats: booking.seats.map(seat => ({
          ...seat,
          status: seat.status as SeatStatus,
        })),
      };
    });
  };

  const confirmBooking = async (
    userId: number,
    bookingId: number
  ): Promise<Booking> => {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId, userId, status: 'reserved' },
        include: { seats: true },
      });

      if (!booking) throw new Error('Valid reserved booking not found');
      if (booking.reservationExpiry && booking.reservationExpiry < new Date())
        throw new Error('Reservation expired');

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'booked', reservationExpiry: null },
        include: { seats: true },
      });

      await tx.seat.updateMany({
        where: { id: { in: booking.seats.map(s => s.id) } },
        data: { status: 'booked' },
      });

      updatedBooking.seats.forEach(seat =>
        broadcastSeatUpdate(updatedBooking.sessionId, seat.id, 'booked')
      );

      logger.info(`User ${userId} confirmed booking ${bookingId}`);

      return {
        ...updatedBooking,
        status: updatedBooking.status as SeatStatus,
        seats: updatedBooking.seats.map(seat => ({
          ...seat,
          status: seat.status as SeatStatus,
        })),
      };
    });
  };

  return {
    reserveSeats,
    confirmBooking,
  };
};
