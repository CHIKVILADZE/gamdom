import { PrismaClient } from '@prisma/client';
import logger from './logger';
import { broadcastSeatUpdate } from '../index';

const prisma = new PrismaClient();

export const setReservationTimer = (bookingId: number, expiry: Date) => {
  const timeoutMs = expiry.getTime() - Date.now();
  setTimeout(async () => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { seats: true },
    });
    if (
      booking &&
      booking.status === 'reserved' &&
      booking.reservationExpiry &&
      new Date() >= booking.reservationExpiry
    ) {
      await prisma.seat.updateMany({
        where: { bookingId },
        data: { status: 'available', bookingId: null },
      });
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'expired', reservationExpiry: null },
      });
      booking.seats.forEach(seat =>
        broadcastSeatUpdate(booking.sessionId, seat.id, 'available')
      );
      logger.info(`Booking ${bookingId} expired. Seats freed.`);
    }
  }, timeoutMs);
};