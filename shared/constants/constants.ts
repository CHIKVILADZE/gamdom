export const SEAT_STATUSES = ['available', 'reserved', 'booked'] as const;
export const RESERVATION_TIMEOUT_MS = 2 * 60 * 1000; // 2 min
export type SeatStatus = typeof SEAT_STATUSES[number];
