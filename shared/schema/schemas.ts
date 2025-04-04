import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});
export type SignupData = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3, "Password must be at least 3 characters"),
});
export type SigninData = z.infer<typeof signinSchema>;

export const reserveSchema = z.object({
  sessionId: z.number(),
  seatIds: z.array(z.number()).min(1, 'At least one seat must be selected'),
});

export const sessionSchema = z.object({
  movieId: z.number(),
  startTime: z.string().datetime(),
  totalRows: z.number().min(1),
  seatsPerRow: z.number().min(1),
});