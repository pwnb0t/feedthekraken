import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Players, Role } from '../api/collections';

interface CultConversionSetupProps {
  gameId: string;
  playerId: string;
  isHost: boolean;
  playerRole: Role;
  isConvertEligible: boolean;
}

export const CultConversionSetup: React.FC<CultConversionSetupProps> = ({
  gameId,
  playerId,
  isHost,
  playerRole,
  isConvertEligible,
}) => {
  const [answered, setAnswered] = useState(false);

  const { allPlayers, currentPlayer } = useTracker(() => {
    const allPlayers = Players.find({ gameId }).fetch();
    const currentPlayer = Players.findOne(playerId);
    return { allPlayers, currentPlayer };
  }, [gameId, playerId]);

  const readyCount = allPlayers.filter((p) => p.isReady).length;
  const totalPlayers = allPlayers.length;
  const allReady = readyCount === totalPlayers;
  const isReady = currentPlayer?.isReady || false;

  const handleAnswer = (eligible: boolean) => {
    // Cult leader and cultists are always ineligible
    const actualEligibility =
      playerRole === Role.CultLeader || playerRole === Role.Cultist ? false : eligible;

    Meteor.call('players.setConvertEligible', playerId, actualEligibility);
    Meteor.call('players.setReady', playerId, true);
    setAnswered(true);
  };

  const handleUnready = () => {
    Meteor.call('players.setReady', playerId, false);
    setAnswered(false);
  };

  const handleStart = () => {
    Meteor.call('games.startCultConversion', gameId, playerId);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      {!answered ? (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Are you eligible to be converted?
          </h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => handleAnswer(true)}
              style={{
                flex: 1,
                padding: '1rem',
                fontSize: '1.2rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              style={{
                flex: 1,
                padding: '1rem',
                fontSize: '1.2rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#666', textAlign: 'center' }}>
            You are ineligible if you have been cabin-searched, flogged, or converted. This question
            is asked of all players, even cultists. If you are a cultist, your answer here does not
            matter.
          </p>
        </>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>Eligibility recorded</h2>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1rem' }}>
            {readyCount}/{totalPlayers} players ready...
          </div>

          <button
            onClick={handleUnready}
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
            Change Answer
          </button>

          {isHost && (
            <>
              <div
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                }}
              >
                <strong>Read aloud when ready:</strong> Everyone close your eyes. After I count to 5,
                Cult Leader, open your eyes and select a player to convert to your dastardly cult, then
                close your eyes when prompted.
              </div>
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
                Tap this button and count to 5
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};
