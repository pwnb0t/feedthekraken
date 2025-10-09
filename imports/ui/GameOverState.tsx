import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Role } from '../api/collections';
import { ConfirmDialog } from './ConfirmDialog';

interface PlayerInfo {
  name: string;
  role: Role;
}

interface GameOverStateProps {
  gameId: string;
  playerId: string;
  isHost: boolean;
  allPlayers: PlayerInfo[];
}

export const GameOverState: React.FC<GameOverStateProps> = ({
  gameId,
  playerId,
  isHost,
  allPlayers,
}) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

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
      case Role.None:
        return 'No Role';
      default:
        return 'Unknown';
    }
  };

  const handleNewGameSamePlayers = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'New Game - Same Players',
      message: 'Start a new game with the same players? Everyone will need to select roles again.',
      onConfirm: () => {
        Meteor.call('games.newGameSamePlayers', gameId, playerId);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleNewGameDifferentPlayers = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'New Game - Different Players',
      message: 'Start a new game with different players? All other players will be removed from the game.',
      onConfirm: () => {
        Meteor.call('games.newGameDifferentPlayers', gameId, playerId, (error: any) => {
          if (error) {
            alert(error.reason || 'Error starting new game');
          }
        });
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Game Over</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Final Roles</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #dee2e6' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Player</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {allPlayers.map((player, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: '1px solid #dee2e6',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                }}
              >
                <td style={{ padding: '0.75rem' }}>{player.name}</td>
                <td style={{ padding: '0.75rem' }}>{getRoleLabel(player.role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isHost && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={handleNewGameSamePlayers}
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
            New Game with Same Players
          </button>
          <button
            onClick={handleNewGameDifferentPlayers}
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
            New Game with Different Players
          </button>
        </div>
      )}

      {!isHost && (
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>Waiting for host to start a new game...</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
};
