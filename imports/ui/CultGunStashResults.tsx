import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Players } from '../api/collections';

interface CultGunStashResultsProps {
  gameId: string;
  playerId: string;
  gunCount: number;
}

export const CultGunStashResults: React.FC<CultGunStashResultsProps> = ({
  gameId,
  playerId,
  gunCount,
}) => {
  const { allPlayers, currentPlayer } = useTracker(() => {
    const allPlayers = Players.find({ gameId }).fetch();
    const currentPlayer = Players.findOne(playerId);
    return { allPlayers, currentPlayer };
  }, [gameId, playerId]);

  // Play the boat horn on the host device only when results appear
  useEffect(() => {
    if (currentPlayer?.isHost) {
      const audio = new Audio('/assets/boat-horn.mp3');
      audio.play().catch((err) => console.error('Failed to play audio:', err));
    }
  }, [currentPlayer?._id]);

  const readyCount = allPlayers.filter((p) => p.isReady).length;
  const totalPlayers = allPlayers.length;
  const allReady = readyCount === totalPlayers;
  const isReady = currentPlayer?.isReady || false;

  const handleReady = () => {
    Meteor.call('players.setReady', playerId, true);
  };

  useEffect(() => {
    if (allReady) {
      // All players ready, transition back to InProgress
      Meteor.call('games.finishCultGunStashResults', gameId);
    }
  }, [allReady, gameId]);

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img src="/assets/gun.png" alt="Gun" style={{ width: '100px', marginBottom: '1rem' }} />
        <h2>Your gun count</h2>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{gunCount}</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1rem' }}>
        {readyCount}/{totalPlayers} players ready...
      </div>

      <button
        onClick={handleReady}
        disabled={isReady}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          backgroundColor: isReady ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isReady ? 'not-allowed' : 'pointer',
        }}
      >
        {isReady ? 'Waiting...' : 'Ready'}
      </button>
    </div>
  );
};
