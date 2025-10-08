import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Games, Players, GameState, Role } from '../api/collections';
import { GameHeader } from './GameHeader';
import { SetupState } from './SetupState';
import { WaitingState } from './WaitingState';

interface GameScreenProps {
  gameId: string;
  playerId: string;
}

export const GameScreen: React.FC<GameScreenProps> = ({ gameId, playerId }) => {
  const { game, player, allPlayers, loading } = useTracker(() => {
    const game = Games.findOne(gameId);
    const player = Players.findOne(playerId);
    const allPlayers = Players.find({ gameId }).fetch();

    return {
      game,
      player,
      allPlayers,
      loading: !game || !player,
    };
  }, [gameId, playerId]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  const playersWithRoles = allPlayers.filter((p) => p.role !== Role.None).length;

  return (
    <div>
      <GameHeader playerName={player!.name} roomCode={game!.roomCode} />

      {game!.gameState === GameState.Setup && (
        <SetupState
          gameId={gameId}
          playerId={playerId}
          isHost={player!.isHost}
          numberOfPlayers={game!.numberOfPlayers}
          roomCode={game!.roomCode}
        />
      )}

      {game!.gameState === GameState.Waiting && (
        <WaitingState
          gameId={gameId}
          playerId={playerId}
          isHost={player!.isHost}
          playerRole={player!.role}
          numberOfPlayers={game!.numberOfPlayers}
          totalPlayers={allPlayers.length}
          playersWithRoles={playersWithRoles}
        />
      )}

      {game!.gameState === GameState.InProgress && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Game In Progress</h2>
          <p>Phase 2 features coming soon...</p>
        </div>
      )}
    </div>
  );
};
