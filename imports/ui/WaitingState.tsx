import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Role } from '../api/collections';

interface WaitingStateProps {
  gameId: string;
  playerId: string;
  isHost: boolean;
  playerRole: Role;
  numberOfPlayers: number;
  totalPlayers: number;
  playersWithRoles: number;
}

export const WaitingState: React.FC<WaitingStateProps> = ({
  gameId,
  playerId,
  isHost,
  playerRole,
  numberOfPlayers,
  totalPlayers,
  playersWithRoles,
}) => {
  const handleRoleSelect = (role: Role) => {
    Meteor.call('players.setRole', playerId, role);
  };

  const handleStartGame = () => {
    Meteor.call('games.startGame', gameId, playerId);
  };

  const allReady = numberOfPlayers === totalPlayers && playersWithRoles === totalPlayers;

  if (playerRole === Role.None) {
    return (
      <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Select Role</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          {[
            { role: Role.Sailor, image: 'sailor.png', label: 'Sailor' },
            { role: Role.Pirate, image: 'pirate.png', label: 'Pirate' },
            { role: Role.CultLeader, image: 'cultleader.png', label: 'Cult Leader' },
            { role: Role.Cultist, image: 'cultist.png', label: 'Cultist' },
          ].map(({ role, image, label }) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid #ccc',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <img
                src={`/assets/${image}`}
                alt={label}
                style={{ width: '100px', height: '100px', marginBottom: '0.5rem' }}
              />
              <span style={{ fontWeight: 'bold' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Role Selected</h2>

      {isHost && (
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => {
              const audio = new Audio('/assets/boat-horn.mp3');
              audio.play();
            }}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Test Sound
          </button>
        </div>
      )}

      {allReady ? (
        <>
          {isHost ? (
            <>
              <p>All players ready!</p>
              <button
                onClick={handleStartGame}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '1rem',
                }}
              >
                Start Game
              </button>
            </>
          ) : (
            <p>Waiting for host to start game...</p>
          )}
        </>
      ) : (
        <p>
          Waiting for other players ({playersWithRoles}/{numberOfPlayers} ready)...
        </p>
      )}
    </div>
  );
};
