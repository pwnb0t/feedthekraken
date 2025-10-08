import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Players } from '../api/collections';

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
  const { allPlayers, currentPlayer } = useTracker(() => {
    const allPlayers = Players.find({ gameId }).fetch();
    const currentPlayer = Players.findOne(playerId);
    return { allPlayers, currentPlayer };
  }, [gameId, playerId]);

  const readyCount = allPlayers.filter((p) => p.isReady).length;
  const totalPlayers = allPlayers.length;
  const allReady = readyCount === totalPlayers;
  const isReady = currentPlayer?.isReady || false;

  const handleIncrement = () => {
    Meteor.call('players.setGunCount', playerId, gunCount + 1);
  };

  const handleDecrement = () => {
    if (gunCount > 0) {
      Meteor.call('players.setGunCount', playerId, gunCount - 1);
    }
  };

  const handleReady = () => {
    Meteor.call('players.setReady', playerId, true);
  };

  const handleUndo = () => {
    Meteor.call('players.setReady', playerId, false);
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
            disabled={gunCount <= 0 || isReady}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1.5rem',
              cursor: gunCount <= 0 || isReady ? 'not-allowed' : 'pointer',
            }}
          >
            -
          </button>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3rem', textAlign: 'center' }}>
            {gunCount}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isReady}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1.5rem',
              cursor: isReady ? 'not-allowed' : 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>

      {!isReady ? (
        <button
          onClick={handleReady}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '1rem',
          }}
        >
          Ready
        </button>
      ) : (
        <>
          <div
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            Waiting for other players ({readyCount}/{totalPlayers} ready)...
          </div>
          <button
            onClick={handleUndo}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            Undo
          </button>
        </>
      )}

      {isHost && (
        <button
          onClick={handleStart}
          disabled={!allReady}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: allReady ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: allReady ? 'pointer' : 'not-allowed',
          }}
        >
          {allReady ? 'Start Cult Gun Stash Step' : `Waiting for other players (${readyCount}/${totalPlayers} ready)...`}
        </button>
      )}
    </div>
  );
};
