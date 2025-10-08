import React from 'react';
import { Meteor } from 'meteor/meteor';

interface CultGunStashSetupProps {
  gameId: string;
  playerId: string;
  isHost: boolean;
  gunCount: number;
}

export const CultGunStashSetup: React.FC<CultGunStashSetupProps> = ({
  gameId,
  playerId,
  isHost,
  gunCount,
}) => {
  const handleIncrement = () => {
    Meteor.call('players.setGunCount', playerId, gunCount + 1);
  };

  const handleDecrement = () => {
    if (gunCount > 0) {
      Meteor.call('players.setGunCount', playerId, gunCount - 1);
    }
  };

  const handleStart = () => {
    Meteor.call('games.startCultGunStash', gameId, playerId);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img src="/assets/gun.png" alt="Gun" style={{ width: '100px', marginBottom: '1rem' }} />
        <h2>Set your gun count</h2>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleDecrement}
            disabled={gunCount <= 0}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1.5rem',
              cursor: gunCount <= 0 ? 'not-allowed' : 'pointer',
            }}
          >
            -
          </button>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3rem', textAlign: 'center' }}>
            {gunCount}
          </span>
          <button
            onClick={handleIncrement}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>

      {isHost && (
        <button
          onClick={handleStart}
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
          Start Cult Gun Stash Step
        </button>
      )}
    </div>
  );
};
