import React, { useState, useEffect } from 'react';
import { Session } from "@shared/interface/interfaces";
import { SeatStatus } from "@shared/constants/constants";
import {
  getAllSessions,
  getSessionById,
  reserveSeats,
  confirmBooking
} from "../services/sessionService";

import SessionSelector from "./SessionSelector";
import SessionInfo from "./SessionInfo";
import MessageAlert from "./MessageAlert";
import SeatLegend from "./SeatLegend";
import SeatGrid from "./SeatGrid";

interface MessageState {
  text: string;
  type: 'success' | 'error' | '';
}

const CinemaSeatMap: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token")!;
        const res = await getAllSessions(token);
        setSessions(res);
      } catch (err) {
        setMessage({ text: "Failed to fetch sessions.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    const fetchSession = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token")!;
        const res = await getSessionById(selectedSessionId, token);
        setSession(res);
        setSelectedSeats([]);
        setBookingId(null);
        setMessage({ text: '', type: '' });
      } catch (err) {
        setMessage({ text: "Failed to fetch session data.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [selectedSessionId]);

  useEffect(() => {
    if (!session) return;

    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => console.log(" WebSocket connected");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.sessionId === session.id) {
        setSession((prev) => {
          if (!prev) return prev;
          const updatedSeats = prev.seats?.map(seat =>
            seat.id === data.seatId ? { ...seat, status: data.status } : seat
          );
          return { ...prev, seats: updatedSeats };
        });
      }
    };

    socket.onclose = () => console.log("WebSocket disconnected");

    return () => socket.close();
  }, [session]);

  const toggleSeat = (seatId: number, status: SeatStatus) => {
    if (status !== "available" || loading) return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleReserve = async () => {
    if (!session || selectedSeats.length === 0) {
      setMessage({ text: 'Please select at least one seat', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem("token")!;
      const res = await reserveSeats(session.id, selectedSeats, token);
      setBookingId(res.id);

      const updated = await getSessionById(session.id, token);
      setSession(updated);

      setMessage({ text: 'Seats reserved! Please confirm your booking.', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to reserve seats.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!bookingId || !session) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem("token")!;
      await confirmBooking(bookingId, token);

      const updated = await getSessionById(session.id, token);
      setSession(updated);

      setBookingId(null);
      setSelectedSeats([]);
      setMessage({ text: 'Booking confirmed! Enjoy the movie.', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to confirm booking.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg p-4 mb-5 bg-white rounded container mt-5">
      <h2 className="text-center mb-3">🎬 Cinema Booking</h2>

      <SessionSelector
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onChange={setSelectedSessionId}
      />

      {session && <SessionInfo session={session} />}
      <MessageAlert text={message.text} type={message.type} />

      {session && (
        <>
          <SeatLegend />
          <div className="text-center mb-4">
            <div className="bg-secondary rounded-pill mx-auto mb-1" style={{ width: '70%', height: '20px' }}></div>
            <span className="text-muted small">SCREEN</span>
          </div>

          <SeatGrid
            seats={session.seats ?? []}
            totalRows={session.totalRows}
            seatsPerRow={session.seatsPerRow}
            selectedSeats={selectedSeats}
            loading={loading}
            toggleSeat={toggleSeat}
          />

          <div className="text-center">
            {selectedSeats.length > 0 && !bookingId && (
              <button className="btn btn-primary me-2" onClick={handleReserve} disabled={loading}>
                {loading ? 'Processing...' : `Reserve (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})`}
              </button>
            )}

            {bookingId && (
              <button className="btn btn-success" onClick={handleConfirm} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            )}
          </div>

          {selectedSeats.length > 0 && (
            <div className="mt-3 text-center text-muted small">
              Selected seats: {selectedSeats.map(id => {
                const seat = session.seats?.find(s => s.id === id);
                return seat ? `${seat.row}-${seat.seatNumber}` : '';
              }).join(', ')}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CinemaSeatMap;
