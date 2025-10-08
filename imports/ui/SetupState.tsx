import React from 'react';
import { Meteor } from 'meteor/meteor';

interface SetupStateProps {
  gameId: string;
  playerId: string;
  isHost: boolean;
  numberOfPlayers: number;
  roomCode: string;
}

export const SetupState: React.FC<SetupStateProps> = ({
  gameId,
  playerId,
  isHost,
  numberOfPlayers,
  roomCode,
}) => {
  const handleIncrement = () => {
    if (numberOfPlayers < 11) {
      Meteor.call('games.setNumberOfPlayers', gameId, playerId, numberOfPlayers + 1);
    }
  };

  const handleDecrement = () => {
    if (numberOfPlayers > 5) {
      Meteor.call('games.setNumberOfPlayers', gameId, playerId, numberOfPlayers - 1);
    }
  };

  const handleStartWaitingRoom = () => {
    Meteor.call('games.startWaitingRoom', gameId, playerId);
  };

  if (!isHost) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Waiting for Host to start waiting room...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Setup Room</h2>

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <strong>Room Code: {roomCode}</strong>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Number of Players</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleDecrement}
            disabled={numberOfPlayers <= 5}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1.5rem',
              cursor: numberOfPlayers <= 5 ? 'not-allowed' : 'pointer',
            }}
          >
            -
          </button>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3rem', textAlign: 'center' }}>
            {numberOfPlayers}
          </span>
          <button
            onClick={handleIncrement}
            disabled={numberOfPlayers >= 11}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1.5rem',
              cursor: numberOfPlayers >= 11 ? 'not-allowed' : 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleStartWaitingRoom}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Start Waiting Room
      </button>
    </div>
  );
};
