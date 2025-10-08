import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Role } from '../api/collections';

interface EligiblePlayer {
  _id: string;
  name: string;
}

interface CultConversionInProgressProps {
  gameId: string;
  playerId: string;
  playerRole: Role;
  eligiblePlayers: EligiblePlayer[];
}

export const CultConversionInProgress: React.FC<CultConversionInProgressProps> = ({
  gameId,
  playerId,
  playerRole,
  eligiblePlayers,
}) => {
  const [converting, setConverting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [cultLeaderReady, setCultLeaderReady] = useState(false);

  // 5 second delay before showing cult leader view
  useEffect(() => {
    if (playerRole === Role.CultLeader) {
      const timer = setTimeout(() => {
        setCultLeaderReady(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [playerRole]);

  useEffect(() => {
    if (converting && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (converting && countdown === 0) {
      Meteor.call('games.finishCultConversion', gameId, playerId);
    }
  }, [converting, countdown, gameId, playerId]);

  const handleConvert = (targetPlayerId: string) => {
    Meteor.call('players.convertToCult', targetPlayerId);
    setConverting(true);
  };

  // Show "Eyes closed" to everyone initially, including cult leader for first 5 seconds
  // Also show "Close your eyes" after conversion
  if (playerRole !== Role.CultLeader || !cultLeaderReady || converting) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>{converting ? 'Close your eyes' : 'Eyes closed'}</h2>
        {converting && (
          <p style={{ fontSize: '1.5rem', marginTop: '2rem' }}>
            Moving to results screen in {countdown}...
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Cult Conversion</h2>

      {eligiblePlayers.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <p>No eligible players to convert</p>
          <button
            onClick={() => setConverting(true)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            Continue
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {eligiblePlayers.map((player) => (
            <div
              key={player._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <span>{player.name}</span>
              <button
                onClick={() => handleConvert(player._id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Convert
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
