import { SeatStatus } from "../constants/constants";


  export interface SigninData {
    email: string;
    password: string;
  }
  

export interface Booking {
  id: number;
  sessionId: number;
  userId: number;
  status: SeatStatus
  reservationExpiry: Date | null;
  seats: Seat[];
  createdAt: Date;
}

export interface Seat {
  id: number;
  row: number;
  seatNumber: number;
  status: SeatStatus;
}

export interface JwtPayload {
  userId: number;
}

export interface SeatStatusUpdate {
  sessionId: number;
  seatId: number;
  status: SeatStatus;
}

export interface Movie {
  id: number;
  title: string;
  duration: number;
  sessions?: Session[]; 
}

export interface Session {
  id: number;
  movieId: number;
  startTime: Date;
  totalRows: number;
  movie: Movie;   
  seatsPerRow: number;
  seats?: Seat[];
  bookings?: Booking[];
}