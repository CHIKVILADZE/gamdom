import React from 'react';
import { Session } from "../../../shared/interface/interfaces";

interface Props {
  sessions: Session[];
  selectedSessionId: number | null;
  onChange: (id: number) => void;
}

const SessionSelector: React.FC<Props> = ({ sessions, selectedSessionId, onChange }) => {
  return (
    <div className="mb-4 text-center">
      <label className="form-label me-2">Choose a session:</label>
      <select
        className="form-select d-inline-block w-auto"
        value={selectedSessionId ?? ''}
        onChange={e => onChange(Number(e.target.value))}
      >
        <option value="" disabled>Select session</option>
        {sessions.map(s => (
          <option key={s.id} value={s.id}>
            {`${s.movie.title} - ${new Date(s.startTime).toLocaleString()}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SessionSelector;
