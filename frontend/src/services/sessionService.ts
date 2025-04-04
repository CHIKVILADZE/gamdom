import api from "../utils/api";

export const getAllSessions = async (token: string) => {
  const res = await api.get("/sessions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getSessionById = async (id: number, token: string) => {
  const res = await api.get(`/sessions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const reserveSeats = async (sessionId: number, seatIds: number[], token: string) => {
  const res = await api.post(
    `/sessions/${sessionId}/reserve`,
    { sessionId, seatIds },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const confirmBooking = async (bookingId: number, token: string) => {
  return await api.post(`/bookings/${bookingId}/confirm`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
