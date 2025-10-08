import React, { useState } from 'react';

interface LandingPageProps {
  onJoinGame: (roomCode: string, playerName: string) => void;
  onCreateGame: (playerName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onJoinGame, onCreateGame }) => {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');

  const handlePlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim() && name.trim()) {
      onJoinGame(roomCode.trim().toUpperCase(), name.trim());
    }
  };

  const handleCreateGame = () => {
    if (name.trim()) {
      onCreateGame(name.trim());
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Feed the Kraken</h1>
      
      <form onSubmit={handlePlay}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={4}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', textTransform: 'uppercase' }}
            placeholder="ABCD"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            placeholder="Your name"
          />
        </div>

        <button
          type="submit"
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
          disabled={!roomCode.trim() || !name.trim()}
        >
          Play
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          onClick={handleCreateGame}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          disabled={!name.trim()}
        >
          Or create a new game
        </button>
      </div>
    </div>
  );
};
