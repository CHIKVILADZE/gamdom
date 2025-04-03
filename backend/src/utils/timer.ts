import { PrismaClient } from '@prisma/client';
import logger from './logger';
import { broadcastSeatUpdate } from '../index';

const prisma = new PrismaClient();

export const setReservationTimer = (bookingId: number, expiry: Date): void => {
  const timeoutMs = expiry.getTime() - Date.now();

  if (timeoutMs <= 0) {
    logger.warn(`Timer for booking ${bookingId} has invalid timeoutMs: ${timeoutMs}`);
    return;
  }

  logger.info(`Setting timer for booking ${bookingId} with timeoutMs: ${timeoutMs}`);

  setTimeout(async () => {
    logger.info(`Timer executed for booking ${bookingId} at ${new Date().toISOString()}`);
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { seats: true },
      });

      if (!booking) {
        logger.warn(`Booking ${bookingId} not found`);
        return;
      }

      if (
        booking.status === 'reserved' &&
        booking.reservationExpiry &&
        new Date() >= booking.reservationExpiry
      ) {
        await prisma.seat.updateMany({
          where: { bookingId: booking.id },
          data: { status: 'available', bookingId: null },
        });
        logger.info(`Seats for booking ${bookingId} set to available`);

        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'expired', reservationExpiry: null },
        });
        logger.info(`Booking ${bookingId} set to expired`);

        booking.seats.forEach((seat) =>
          broadcastSeatUpdate(booking.sessionId, seat.id, 'available')
        );
        logger.info(`Booking ${bookingId} expired and seats freed`);
      } else {
        logger.info(
          `Booking ${bookingId} not expired. Status: ${booking.status}, Expiry: ${booking.reservationExpiry}`
        );
      }
    } catch (error) {
      logger.error(`Error in setReservationTimer for booking ${bookingId}: ${error}`);
    }
  }, timeoutMs);
};