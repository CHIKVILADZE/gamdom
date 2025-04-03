import { Request, Response } from 'express';
import { createBookingService } from '../services/bookingService';
import prisma from '../prisma/prisma';

const bookingService = createBookingService(prisma);

export const reserveSeats = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const booking = await bookingService.reserveSeats(userId, req.body);
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const bookingId = parseInt(req.params.bookingId);
    const booking = await bookingService.confirmBooking(userId, bookingId);
    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
