import React from 'react';
import { Session } from "@shared/interface/interfaces";

const SessionInfo: React.FC<{ session: Session }> = ({ session }) => (
  <div className="text-center mb-4">
    <h4 className="fw-bold">{session.movie?.title}</h4>
    <p className="text-muted mb-1">{new Date(session.startTime).toLocaleString()}</p>
    <p className="text-muted">Duration: {session.movie?.duration} minutes</p>
  </div>
);

export default SessionInfo;
