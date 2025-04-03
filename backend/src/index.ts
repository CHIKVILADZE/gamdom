import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import authRoutes from './routes/authRoutes';
import sessionRoutes from './routes/sessionRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import dotenv from 'dotenv';
import { SeatStatus } from '../../shared/constants/constants';
dotenv.config();

const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/bookings', bookingRoutes);
app.use(errorMiddleware);

ws.on('connection', (ws) => {
  ws.on('message', (message) => console.log('Received:', message));
});

export const broadcastSeatUpdate = (sessionId: number, seatId: number, status: SeatStatus) => {
  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ sessionId, seatId, status }));
    }
  });
};

server.listen(5000, () => {
  console.log('Server running on portsss 5000');
});