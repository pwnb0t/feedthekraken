import React, { useState } from 'react';
import { GameState } from '../api/collections';
import { clearSession } from '../utils/sessionStorage';
import { ConfirmDialog } from './ConfirmDialog';

interface GameHeaderProps {
  playerName: string;
  roomCode: string;
  gameState: GameState;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ playerName, roomCode, gameState }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const getFriendlyGameState = (state: GameState): string => {
    switch (state) {
      case GameState.Setup:
      case GameState.Waiting:
        return 'Setup';
      case GameState.InProgress:
        return 'Main';
      case GameState.CultGunStashSetup:
      case GameState.CultGunStashInProgress:
      case GameState.CultGunStashResults:
        return 'Cult Gun Stash';
      case GameState.CultConversionSetup:
      case GameState.CultConversionInProgress:
        return 'Cult Conversion';
      case GameState.RoleReveal:
        return 'Role Reveal';
      case GameState.GameOver:
        return 'Game Over';
      default:
        return 'Game';
    }
  };

  const handleExit = () => {
    setIsMenuOpen(false);
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    clearSession();
    window.location.reload();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #dee2e6',
        position: 'relative',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>{getFriendlyGameState(gameState)}</div>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '1.2rem',
          backgroundColor: 'transparent',
          border: '2px solid #dee2e6',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        ☰
      </button>

      {isMenuOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
              zIndex: 999,
            }}
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: '1rem',
              backgroundColor: 'white',
              border: '2px solid #dee2e6',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              minWidth: '200px',
              zIndex: 1000,
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                Room Code
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{roomCode}</div>
            </div>
            <div style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                Player Name
              </div>
              <div style={{ fontWeight: 'bold' }}>{playerName}</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <button
                onClick={handleExit}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Exit Game
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Exit Game"
        message="Are you sure you want to exit? You will need to rejoin the game."
        confirmText="Exit"
        onConfirm={confirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
};
