import { reserveSeats as mockReserveSeats, confirmBooking as mockConfirmBooking } from '../mocks/bookingMocks';

jest.mock('../../services/bookingService', () => ({
  createBookingService: () => ({
    reserveSeats: mockReserveSeats,
    confirmBooking: mockConfirmBooking,
  }),
}));

import httpMocks from 'node-mocks-http';
import { reserveSeats, confirmBooking } from '../../../src/controllers/bookingController';

describe('bookingController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('reserveSeats', () => {
    it('should return 201 and booking on success', async () => {
      const mockBooking = { id: 1, status: 'reserved', seats: [] };
      mockReserveSeats.mockResolvedValue(mockBooking);

      const req = httpMocks.createRequest({
        method: 'POST',
        body: { sessionId: 1, seatIds: [1, 2] },
      });
      req.userId = 42;

      const res = httpMocks.createResponse();
      await reserveSeats(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockBooking);
      expect(mockReserveSeats).toHaveBeenCalledWith(42, { sessionId: 1, seatIds: [1, 2] });
    });

    it('should return 400 on error', async () => {
      mockReserveSeats.mockRejectedValue(new Error('Seats unavailable'));

      const req = httpMocks.createRequest({
        method: 'POST',
        body: { sessionId: 1, seatIds: [1, 2] },
      });
      req.userId = 42;

      const res = httpMocks.createResponse();
      await reserveSeats(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Seats unavailable' });
    });
  });

  describe('confirmBooking', () => {
    it('should return 200 and booking on success', async () => {
      const mockBooking = { id: 1, status: 'booked', seats: [] };
      mockConfirmBooking.mockResolvedValue(mockBooking);

      const req = httpMocks.createRequest({
        method: 'POST',
        params: { bookingId: '1' },
      });
      req.userId = 42;

      const res = httpMocks.createResponse();
      await confirmBooking(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockBooking);
      expect(mockConfirmBooking).toHaveBeenCalledWith(42, 1);
    });

    it('should return 400 on error', async () => {
      mockConfirmBooking.mockRejectedValue(new Error('Reservation expired'));

      const req = httpMocks.createRequest({
        method: 'POST',
        params: { bookingId: '1' },
      });
      req.userId = 42;

      const res = httpMocks.createResponse();
      await confirmBooking(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Reservation expired' });
    });
  });
});
