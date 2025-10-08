import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { LandingPage } from './LandingPage';
import { GameScreen } from './GameScreen';

export const App = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const handleJoinGame = (roomCode: string, playerName: string) => {
    Meteor.call('games.join', roomCode, playerName, (error: any, result: any) => {
      if (error) {
        alert(error.reason || 'Error joining game');
      } else {
        setGameId(result.gameId);
        setPlayerId(result.playerId);
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
      }
    });
  };

  if (gameId && playerId) {
    return <GameScreen gameId={gameId} playerId={playerId} />;
  }

  return <LandingPage onJoinGame={handleJoinGame} onCreateGame={handleCreateGame} />;
};
