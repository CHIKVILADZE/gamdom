import React from 'react';
import { Seat } from "@shared/interface/interfaces";
import { SeatStatus } from "@shared/constants/constants";

interface Props {
  seats: Seat[];
  totalRows: number;
  seatsPerRow: number;
  selectedSeats: number[];
  loading: boolean;
  toggleSeat: (seatId: number, status: SeatStatus) => void;
}

const SeatGrid: React.FC<Props> = ({
  seats,
  totalRows,
  seatsPerRow,
  selectedSeats,
  loading,
  toggleSeat
}) => {
  const rows = [];

  for (let row = 1; row <= totalRows; row++) {
    const cols = [<div key={`label-${row}`} className="fw-bold me-2">{row}</div>];

    for (let col = 1; col <= seatsPerRow; col++) {
      const seat = seats.find(s => s.row === row && s.seatNumber === col);
      if (seat) {
        const isSelected = selectedSeats.includes(seat.id);
        let btnClass = "btn-outline-secondary";

        if (seat.status === "booked") btnClass = "btn-danger disabled";
        else if (seat.status === "reserved") btnClass = "btn-warning disabled";
        else if (isSelected) btnClass = "btn-success";

        cols.push(
          <button
            key={seat.id}
            className={`btn btn-sm ${btnClass} m-1`}
            style={{ width: '40px', height: '40px' }}
            onClick={() => toggleSeat(seat.id, seat.status)}
            disabled={seat.status !== "available" || loading}
            title={`Row ${seat.row}, Seat ${seat.seatNumber}`}
          >
            {col}
          </button>
        );
      }
    }

    rows.push(
      <div key={row} className="d-flex align-items-center justify-content-center mb-2">
        {cols}
      </div>
    );
  }

  return <div className="mb-4">{rows}</div>;
};

export default SeatGrid;
