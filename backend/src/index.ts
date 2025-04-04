import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors'; 
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import sessionRoutes from './routes/sessionRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { SeatStatus } from '@shared/constants/constants';
import moviesRoutes from './routes/movieRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/bookings', bookingRoutes);
app.use('/movies', moviesRoutes); 
app.use(errorMiddleware);

ws.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    ws.send(`Echo: ${message}`);
  });
});

export const broadcastSeatUpdate = (sessionId: number, seatId: number, status: SeatStatus) => {
  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ sessionId, seatId, status }));
    }
  });
};

server.listen(5000,'0.0.0.0', () => {
  console.log('Server running on portsss 5000');
});
