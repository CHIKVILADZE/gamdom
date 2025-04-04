import React from 'react';

interface Props {
  text: string;
  type: 'success' | 'error' | '';
}

const MessageAlert: React.FC<Props> = ({ text, type }) => {
  if (!text) return null;
  return (
    <div className={`alert text-center ${type === 'error' ? 'alert-danger' : 'alert-success'}`} role="alert">
      {text}
    </div>
  );
};

export default MessageAlert;
