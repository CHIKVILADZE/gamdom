import { createBookingService } from '../../services/bookingService';
import { prismaMock } from '../mocks/prismaClientMock';
import { RESERVATION_TIMEOUT_MS, SeatStatus } from '@shared/constants/constants';
import { reserveSchema } from '@shared/schema/schemas';

jest.mock('../../utils/timer', () => ({
  setReservationTimer: jest.fn(),
}));

jest.mock('../../utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
  },
}));

jest.mock('../../index', () => ({
  broadcastSeatUpdate: jest.fn(),
}));

jest.mock('@shared/schema/schemas', () => ({
  reserveSchema: {
    parse: jest.fn(),
  },
}));

const { reserveSeats, confirmBooking } = createBookingService(prismaMock);

describe('bookingService', () => {
  const userId = 1;
  const sessionId = 1;
  const seatIds = [1, 2];
  const expiry = new Date(Date.now() + RESERVATION_TIMEOUT_MS);

  beforeEach(() => {
    jest.clearAllMocks();
    (reserveSchema.parse as jest.Mock).mockImplementation(data => data);
  });

  describe('reserveSeats', () => {
    const reserveData = { sessionId, seatIds };

    it('should successfully reserve available seats', async () => {
      const mockSeats = [
        { id: 1, sessionId, status: 'available', row: 1, seatNumber: 1, bookingId: null },
        { id: 2, sessionId, status: 'available', row: 1, seatNumber: 2, bookingId: null },
      ];

      const mockBooking = {
        id: 1,
        sessionId,
        userId,
        status: 'reserved' as SeatStatus,
        reservationExpiry: expiry,
        createdAt: new Date(),
        seats: mockSeats.map(seat => ({
          ...seat,
          status: 'reserved' as SeatStatus,
        })),
      };

      prismaMock.seat.findMany.mockResolvedValue(mockSeats);
      prismaMock.booking.create.mockResolvedValue(mockBooking);
      prismaMock.seat.updateMany.mockResolvedValue({ count: 2 });

      prismaMock.$transaction.mockImplementation(async (fn: any) => {
        return await fn(prismaMock);
      });

      const result = await reserveSeats(userId, reserveData);

      expect(reserveSchema.parse).toHaveBeenCalledWith(reserveData);
      expect(result).toEqual(mockBooking);
    });

    it('should throw error when some seats are not available', async () => {
      const mockSeats = [
        { id: 1, sessionId, status: 'reserved', row: 1, seatNumber: 1, bookingId: null },
      ];

      prismaMock.seat.findMany.mockResolvedValue(mockSeats);
      prismaMock.$transaction.mockImplementation(async (fn: any) => {
        return await fn(prismaMock);
      });

      await expect(reserveSeats(userId, reserveData)).rejects.toThrow(
        'Some seats are not available'
      );
    });
  });

  describe('confirmBooking', () => {
    const bookingId = 1;

    it('should successfully confirm a reserved booking', async () => {
      const mockBooking = {
        id: bookingId,
        sessionId,
        userId,
        status: 'reserved' as SeatStatus,
        reservationExpiry: new Date(Date.now() + 10000),
        createdAt: new Date(),
        seats: [
          { id: 1, status: 'reserved', row: 1, seatNumber: 1, sessionId, bookingId },
          { id: 2, status: 'reserved', row: 1, seatNumber: 2, sessionId, bookingId },
        ],
      };

      const updatedBooking = {
        ...mockBooking,
        status: 'booked' as SeatStatus,
        reservationExpiry: null,
        seats: mockBooking.seats.map(seat => ({
          ...seat,
          status: 'booked' as SeatStatus,
        })),
      };

      prismaMock.booking.findUnique.mockResolvedValue(mockBooking);
      prismaMock.booking.update.mockResolvedValue(updatedBooking);
      prismaMock.seat.updateMany.mockResolvedValue({ count: 2 });

      prismaMock.$transaction.mockImplementation(async (fn: any) => {
        return await fn(prismaMock);
      });

      const result = await confirmBooking(userId, bookingId);

      expect(result).toEqual(updatedBooking);
    });

    it('should throw error for expired reservation', async () => {
      const mockBooking = {
        id: bookingId,
        sessionId,
        userId,
        status: 'reserved' as SeatStatus,
        reservationExpiry: new Date(Date.now() - 10000),
        createdAt: new Date(),
        seats: [{ id: 1, status: 'reserved', row: 1, seatNumber: 1, sessionId, bookingId }],
      };

      prismaMock.booking.findUnique.mockResolvedValue(mockBooking);
      prismaMock.$transaction.mockImplementation(async (fn: any) => {
        return await fn(prismaMock);
      });

      await expect(confirmBooking(userId, bookingId)).rejects.toThrow(
        'Reservation expired'
      );
    });

    it('should throw error when booking not found', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(null);
      prismaMock.$transaction.mockImplementation(async (fn: any) => {
        return await fn(prismaMock);
      });

      await expect(confirmBooking(userId, bookingId)).rejects.toThrow(
        'Valid reserved booking not found'
      );
    });
  });
});
