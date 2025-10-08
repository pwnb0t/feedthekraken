import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Games, Players, GameState, Role } from '../api/collections';
import { GameHeader } from './GameHeader';
import { SetupState } from './SetupState';
import { WaitingState } from './WaitingState';
import { InProgressState } from './InProgressState';
import { CultGunStashSetup } from './CultGunStashSetup';
import { CultGunStashInProgress } from './CultGunStashInProgress';
import { CultGunStashResults } from './CultGunStashResults';
import { CultConversionSetup } from './CultConversionSetup';
import { CultConversionInProgress } from './CultConversionInProgress';
import { RoleRevealState } from './RoleRevealState';

interface GameScreenProps {
  gameId: string;
  playerId: string;
}

export const GameScreen: React.FC<GameScreenProps> = ({ gameId, playerId }) => {
  const { game, player, allPlayers, loading } = useTracker(() => {
    const gameSub = Meteor.subscribe('game', gameId);
    const playersSub = Meteor.subscribe('players', gameId);
    const playerSub = Meteor.subscribe('player', playerId);

    if (!gameSub.ready() || !playersSub.ready() || !playerSub.ready()) {
      return { game: null, player: null, allPlayers: [], loading: true };
    }

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
  const eligiblePlayers = allPlayers.filter((p) => p.isConvertEligible);

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
        <InProgressState gameId={gameId} playerId={playerId} isHost={player!.isHost} />
      )}

      {game!.gameState === GameState.CultGunStashSetup && (
        <CultGunStashSetup
          gameId={gameId}
          playerId={playerId}
          isHost={player!.isHost}
          gunCount={player!.gunCount}
        />
      )}

      {game!.gameState === GameState.CultGunStashInProgress && (
        <CultGunStashInProgress
          gameId={gameId}
          playerId={playerId}
          playerRole={player!.role}
          allPlayers={allPlayers}
        />
      )}

      {game!.gameState === GameState.CultGunStashResults && (
        <CultGunStashResults gameId={gameId} playerId={playerId} gunCount={player!.gunCount} />
      )}

      {game!.gameState === GameState.CultConversionSetup && (
        <CultConversionSetup
          gameId={gameId}
          playerId={playerId}
          isHost={player!.isHost}
          playerRole={player!.role}
        />
      )}

      {game!.gameState === GameState.CultConversionInProgress && (
        <CultConversionInProgress
          gameId={gameId}
          playerId={playerId}
          playerRole={player!.role}
          eligiblePlayers={eligiblePlayers}
        />
      )}

      {game!.gameState === GameState.RoleReveal && (
        <RoleRevealState
          gameId={gameId}
          playerId={playerId}
          isHost={player!.isHost}
          playerRole={player!.role}
        />
      )}
    </div>
  );
};
