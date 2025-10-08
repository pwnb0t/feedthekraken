import React from 'react';
import { Meteor } from 'meteor/meteor';
import { GameState } from '../api/collections';

interface InProgressStateProps {
  gameId: string;
  playerId: string;
  isHost: boolean;
}

export const InProgressState: React.FC<InProgressStateProps> = ({ gameId, playerId, isHost }) => {
  const handleSelectAction = (action: GameState) => {
    Meteor.call('games.setGameState', gameId, playerId, action);
  };

  const handleEndGame = () => {
    if (confirm('Are you sure you want to end the game?')) {
      Meteor.call('games.setGameState', gameId, playerId, GameState.GameOver);
    }
  };

  if (!isHost) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Waiting for host to select cult action...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Select Cultist Action</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => handleSelectAction(GameState.CultGunStashSetup)}
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
            src="/assets/cult-gun-stash.png"
            alt="Cult's Gun Stash"
            style={{ width: '150px', height: '150px', marginBottom: '0.5rem' }}
          />
          <span style={{ fontWeight: 'bold' }}>Cult's Gun Stash</span>
        </button>

        <button
          onClick={() => handleSelectAction(GameState.CultConversionSetup)}
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
            src="/assets/cult-conversion.png"
            alt="Conversion to Cult"
            style={{ width: '150px', height: '150px', marginBottom: '0.5rem' }}
          />
          <span style={{ fontWeight: 'bold' }}>Conversion to Cult</span>
        </button>
      </div>

      <button
        onClick={handleEndGame}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '2rem',
        }}
      >
        End Game
      </button>
    </div>
  );
};
