import WebSocket from 'ws';
import http from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import { SeatStatus } from '@shared/constants/constants';

let server: http.Server;
let wsClient: WebSocket;

describe('WebSocket Server', () => {
  let port: number;

  beforeAll((done) => {
    const app = express();
    server = http.createServer(app);

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      ws.on('message', (msg) => console.log('Received from client:', msg));
    });

    server.listen(() => {
      port = (server.address() as AddressInfo).port;
      wsClient = new WebSocket(`ws://localhost:${port}`);
      wsClient.on('open', () => done());
    });

    (global as any).broadcastSeatUpdate = (sessionId: number, seatId: number, status: SeatStatus) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ sessionId, seatId, status }));
        }
      });
    };
  });

  afterAll((done) => {
    wsClient.close();
    server.close(done);
  });

  it('should receive broadcasted seat update', (done) => {
    wsClient.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      expect(msg).toEqual({
        sessionId: 1,
        seatId: 2,
        status: 'reserved',
      });
      done();
    });

    (global as any).broadcastSeatUpdate(1, 2, 'reserved');
  });
});
