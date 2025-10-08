import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Role } from '../api/collections';

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

  const handleAnswer = (eligible: boolean) => {
    // Cult leader and cultists are always ineligible
    const actualEligibility = 
      playerRole === Role.CultLeader || playerRole === Role.Cultist ? false : eligible;
    
    Meteor.call('players.setConvertEligible', playerId, actualEligibility);
    setAnswered(true);
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
            {isHost && <p>Waiting for other players to answer...</p>}
            {!isHost && <p>Waiting for host to start...</p>}
          </div>
          {isHost && (
            <button
              onClick={handleStart}
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
              Start Cult Conversion Step
            </button>
          )}
        </>
      )}
    </div>
  );
};
