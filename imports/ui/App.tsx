import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { LandingPage } from './LandingPage';
import { GameScreen } from './GameScreen';
import { saveSession, loadSession, clearSession } from '../utils/sessionStorage';

export const App = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(true);

  // Try to reconnect on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      // Attempt to rejoin the game with saved credentials
      Meteor.call('games.join', session.roomCode, session.playerName, (error: any, result: any) => {
        if (error) {
          // Session is invalid, clear it
          console.log('Failed to reconnect to saved session:', error.reason);
          clearSession();
          setIsReconnecting(false);
        } else {
          // Successfully reconnected
          setGameId(result.gameId);
          setPlayerId(result.playerId);
          // Update session with potentially new IDs
          saveSession({
            roomCode: session.roomCode,
            playerName: session.playerName,
            gameId: result.gameId,
            playerId: result.playerId,
          });
          setIsReconnecting(false);
        }
      });
    } else {
      setIsReconnecting(false);
    }
  }, []);

  const handleJoinGame = (roomCode: string, playerName: string) => {
    Meteor.call('games.join', roomCode, playerName, (error: any, result: any) => {
      if (error) {
        alert(error.reason || 'Error joining game');
      } else {
        setGameId(result.gameId);
        setPlayerId(result.playerId);
        // Save session for future reconnection
        saveSession({
          roomCode,
          playerName,
          gameId: result.gameId,
          playerId: result.playerId,
        });
      }
    });
  };

  const handleCreateGame = (playerName: string) => {
    Meteor.call('games.create', playerName, (error: any, result: any) => {
      if (error) {
        alert(error.reason || 'Error creating game');
      } else {
        setGameId(result.gameId);
        setPlayerId(result.playerId);
        // Save session for future reconnection
        saveSession({
          roomCode: result.roomCode,
          playerName,
          gameId: result.gameId,
          playerId: result.playerId,
        });
      }
    });
  };

  if (isReconnecting) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Reconnecting...</div>;
  }

  if (gameId && playerId) {
    return <GameScreen gameId={gameId} playerId={playerId} />;
  }

  return <LandingPage onJoinGame={handleJoinGame} onCreateGame={handleCreateGame} />;
};
