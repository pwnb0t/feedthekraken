import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Role } from '../api/collections';

interface PlayerWithGuns {
  _id: string;
  name: string;
  gunCount: number;
}

interface CultGunStashInProgressProps {
  gameId: string;
  playerId: string;
  playerRole: Role;
  allPlayers: PlayerWithGuns[];
}

export const CultGunStashInProgress: React.FC<CultGunStashInProgressProps> = ({
  gameId,
  playerId,
  playerRole,
  allPlayers,
}) => {
  const [distributed, setDistributed] = useState<{ [key: string]: number }>({});

  const totalGuns = allPlayers.reduce((sum, p) => sum + p.gunCount, 0);
  const distributedGuns = Object.values(distributed).reduce((sum, count) => sum + count, 0);
  const remainingGuns = totalGuns - distributedGuns;

  useEffect(() => {
    if (playerRole === Role.CultLeader && remainingGuns === 0 && totalGuns > 0) {
      // Random delay between 2-5 seconds
      const delay = 2000 + Math.random() * 3000;
      const timer = setTimeout(() => {
        // Play sound on host device only
        const audio = new Audio('/assets/boat-horn.mp3');
        audio.play();
        
        // Save distributed guns and return to InProgress
        Meteor.call('games.finishCultGunStash', gameId, playerId, distributed);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [remainingGuns, totalGuns, playerRole, gameId, playerId, distributed]);

  const handleAddGun = (targetPlayerId: string) => {
    setDistributed((prev) => ({
      ...prev,
      [targetPlayerId]: (prev[targetPlayerId] || 0) + 1,
    }));
  };

  if (playerRole !== Role.CultLeader) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Eyes closed.</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Cult Gun Stash</h2>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Remaining Guns: {remainingGuns}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {allPlayers.map((player) => (
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
            <span style={{ marginLeft: 'auto', marginRight: '1rem' }}>
              {player.gunCount} + {distributed[player._id] || 0}
            </span>
            <button
              onClick={() => handleAddGun(player._id)}
              disabled={remainingGuns === 0}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: remainingGuns === 0 ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: remainingGuns === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
