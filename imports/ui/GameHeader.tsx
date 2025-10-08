import React from 'react';

interface GameHeaderProps {
  playerName: string;
  roomCode: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ playerName, roomCode }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #dee2e6',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>{playerName}</div>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{roomCode}</div>
    </div>
  );
};
