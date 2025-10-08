import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Role } from '../api/collections';

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
  const [countdown, setCountdown] = useState(3);
  const [revealed, setRevealed] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    // Play sound on host device only
    if (isHost) {
      const audio = new Audio('/assets/boat-horn.mp3');
      audio.play();
    }
  }, [isHost]);

  useEffect(() => {
    if (!revealed && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!revealed && countdown === 0) {
      setRevealed(true);
      
      // Host automatically returns to InProgress after 3 seconds
      if (isHost) {
        setTimeout(() => {
          Meteor.call('games.finishRoleReveal', gameId, playerId);
        }, 3000);
      }
    }
  }, [countdown, revealed, isHost, gameId, playerId]);

  const handleOk = () => {
    setAcknowledged(true);
  };

  if (!revealed) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Revealing role in {countdown}...</h2>
      </div>
    );
  }

  if (acknowledged) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Waiting...</h2>
      </div>
    );
  }

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
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '2rem' }}>Role: {getRoleLabel(playerRole)}</h2>
      <button
        onClick={handleOk}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Ok
      </button>
    </div>
  );
};
