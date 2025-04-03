export const reserveSeats = jest.fn();
export const confirmBooking = jest.fn();

export const createBookingService = () => ({
  reserveSeats,
  confirmBooking,
});