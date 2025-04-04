import React from 'react';

const SeatLegend: React.FC = () => (
  <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
    {[
      ['Available', 'btn-outline-secondary'],
      ['Selected', 'btn-success'],
      ['Reserved', 'btn-warning'],
      ['Booked', 'btn-danger'],
    ].map(([label, style], i) => (
      <div className="d-flex align-items-center" key={i}>
        <button className={`btn btn-sm ${style} me-2`} style={{ width: '20px', height: '20px' }} disabled></button>
        <span className="small">{label}</span>
      </div>
    ))}
  </div>
);

export default SeatLegend;