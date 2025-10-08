import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Players, Role } from '../api/collections';

interface RoleRevealStateProps {
  gameId: string;
  playerId: string;
  isHost: boolean;
  playerRole: Role;
}

export const RoleRevealState: React.FC<RoleRevealStateProps> = ({
  gameId,
  playerId,
  isHost,
  playerRole,
}) => {
  const [revealed, setRevealed] = useState(false);

  const { allPlayers, currentPlayer } = useTracker(() => {
    const allPlayers = Players.find({ gameId }).fetch();
    const currentPlayer = Players.findOne(playerId);
    return { allPlayers, currentPlayer };
  }, [gameId, playerId]);

  const readyCount = allPlayers.filter((p) => p.isReady).length;
  const totalPlayers = allPlayers.length;
  const allReady = readyCount === totalPlayers;
  const isReady = currentPlayer?.isReady || false;

  useEffect(() => {
    // Play sound on host device only
    if (isHost) {
      const audio = new Audio('/assets/boat-horn.mp3');
      audio.play();
    }
  }, [isHost]);

  useEffect(() => {
    if (allReady) {
      // All players ready, transition back to InProgress
      Meteor.call('games.finishRoleReveal', gameId, playerId);
    }
  }, [allReady, gameId, playerId]);

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleReady = () => {
    Meteor.call('players.setReady', playerId, true);
    setRevealed(false);
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case Role.Sailor:
        return 'Sailor';
      case Role.Pirate:
        return 'Pirate';
      case Role.CultLeader:
        return 'Cult Leader';
      case Role.Cultist:
        return 'Cultist';
      default:
        return 'Unknown';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      {revealed ? (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Role: {getRoleLabel(playerRole)}
          </h2>

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
              backgroundColor: isReady ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isReady ? 'not-allowed' : 'pointer',
            }}
          >
            {isReady ? 'Waiting...' : 'Ready (hides role)'}
          </button>
        </>
      ) : (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Role Reveal</h2>

          <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1rem' }}>
            {readyCount}/{totalPlayers} players ready...
          </div>

          <button
            onClick={handleReveal}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Reveal Role
          </button>
        </>
      )}
    </div>
  );
};
