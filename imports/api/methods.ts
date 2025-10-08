import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games, Players, GameState, Role } from './collections';
import { generateRoomCode } from '../utils/roomCode';

Meteor.methods({
  async 'games.create'(playerName: string) {
    check(playerName, String);

    const roomCode = generateRoomCode();
    const gameId = await Games.insertAsync({
      roomCode,
      numberOfPlayers: 5,
      gameState: GameState.Setup,
      players: [],
      createdAt: new Date(),
    });

    const playerId = await Players.insertAsync({
      gameId,
      name: playerName,
      isHost: true,
      role: Role.None,
      isConvertEligible: false,
      gunCount: 0,
      isReady: false,
    });

    await Games.updateAsync(gameId, { $push: { players: playerId } });

    return { gameId, playerId, roomCode };
  },

  async 'games.reconnect'(playerId: string) {
    check(playerId, String);

    const player = await Players.findOneAsync(playerId);
    if (!player) {
      throw new Meteor.Error('player-not-found', 'Player not found');
    }

    const game = await Games.findOneAsync(player.gameId);
    if (!game) {
      throw new Meteor.Error('game-not-found', 'Game not found');
    }

    return { gameId: game._id!, playerId: player._id!, roomCode: game.roomCode };
  },

  async 'games.join'(roomCode: string, playerName: string) {
    check(roomCode, String);
    check(playerName, String);

    const game = await Games.findOneAsync({ roomCode });
    if (!game) {
      throw new Meteor.Error('game-not-found', 'Game not found');
    }

    // Check if player already exists in this game
    const existingPlayer = await Players.findOneAsync({ gameId: game._id!, name: playerName });
    if (existingPlayer) {
      return { gameId: game._id!, playerId: existingPlayer._id!, roomCode: game.roomCode };
    }

    // Create new player
    const playerId = await Players.insertAsync({
      gameId: game._id!,
      name: playerName,
      isHost: false,
      role: Role.None,
      isConvertEligible: false,
      gunCount: 0,
      isReady: false,
    });

    await Games.updateAsync(game._id!, { $push: { players: playerId } });

    return { gameId: game._id!, playerId, roomCode: game.roomCode };
  },

  async 'games.setNumberOfPlayers'(gameId: string, playerId: string, numberOfPlayers: number) {
    check(gameId, String);
    check(playerId, String);
    check(numberOfPlayers, Number);

    const player = await Players.findOneAsync(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can change this');
    }

    if (numberOfPlayers < 5 || numberOfPlayers > 11) {
      throw new Meteor.Error('invalid-number', 'Number of players must be between 5 and 11');
    }

    await Games.updateAsync(gameId, { $set: { numberOfPlayers } });
  },

  async 'games.startWaitingRoom'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = await Players.findOneAsync(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can start the waiting room');
    }

    await Games.updateAsync(gameId, { $set: { gameState: GameState.Waiting } });
  },

  async 'players.setRole'(playerId: string, role: Role) {
    check(playerId, String);
    check(role, String);

    await Players.updateAsync(playerId, { $set: { role } });
  },

  async 'games.startGame'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = await Players.findOneAsync(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can start the game');
    }

    await Games.updateAsync(gameId, { $set: { gameState: GameState.InProgress } });
  },

  async 'games.setGameState'(gameId: string, playerId: string, newState: GameState) {
    check(gameId, String);
    check(playerId, String);
    check(newState, String);

    const player = await Players.findOneAsync(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can change game state');
    }

    await Games.updateAsync(gameId, { $set: { gameState: newState } });
  },

  async 'players.setGunCount'(playerId: string, gunCount: number) {
    check(playerId, String);
    check(gunCount, Number);

    await Players.updateAsync(playerId, { $set: { gunCount } });
  },

  async 'players.setReady'(playerId: string, isReady: boolean) {
    check(playerId, String);
    check(isReady, Boolean);

    await Players.updateAsync(playerId, { $set: { isReady } });
  },

  async 'games.startCultGunStash'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = await Players.findOneAsync(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can start this');
    }

    // Reset all players' ready status
    const allPlayers = await Players.find({ gameId }).fetchAsync();
    for (const p of allPlayers) {
      await Players.updateAsync(p._id!, { $set: { isReady: false } });
    }

    // Immediately transition to InProgress state
    await Games.updateAsync(gameId, { $set: { gameState: GameState.CultGunStashInProgress } });
  },

  async 'games.finishCultGunStash'(
    gameId: string,
    playerId: string,
    distributed: { [key: string]: number }
  ) {
    check(gameId, String);
    check(playerId, String);
    check(distributed, Object);

    const player = await Players.findOneAsync(playerId);
    if (!player || player.role !== Role.CultLeader) {
      throw new Meteor.Error('not-authorized', 'Only the cult leader can do this');
    }

    // Update gun counts for all players
    for (const [targetPlayerId, addedGuns] of Object.entries(distributed)) {
      const targetPlayer = await Players.findOneAsync(targetPlayerId);
      if (targetPlayer) {
        await Players.updateAsync(targetPlayerId, {
          $set: { gunCount: targetPlayer.gunCount + addedGuns },
        });
      }
    }

    // Reset all players' ready status
    const allPlayers = await Players.find({ gameId }).fetchAsync();
    for (const p of allPlayers) {
      await Players.updateAsync(p._id!, { $set: { isReady: false } });
    }

    await Games.updateAsync(gameId, { $set: { gameState: GameState.CultGunStashResults } });
  },

  async 'games.finishCultGunStashResults'(gameId: string) {
    check(gameId, String);

    // Reset all players' ready status
    const allPlayers = await Players.find({ gameId }).fetchAsync();
    for (const p of allPlayers) {
      await Players.updateAsync(p._id!, { $set: { isReady: false } });
    }

    await Games.updateAsync(gameId, { $set: { gameState: GameState.InProgress } });
  },

  async 'players.setConvertEligible'(playerId: string, isEligible: boolean) {
    check(playerId, String);
    check(isEligible, Boolean);

    await Players.updateAsync(playerId, { $set: { isConvertEligible: isEligible } });
  },

  async 'games.startCultConversion'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = await Players.findOneAsync(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can start this');
    }

    // Reset all players' ready status
    const allPlayers = await Players.find({ gameId }).fetchAsync();
    for (const p of allPlayers) {
      await Players.updateAsync(p._id!, { $set: { isReady: false } });
    }

    // Immediately transition to InProgress state
    await Games.updateAsync(gameId, { $set: { gameState: GameState.CultConversionInProgress } });
  },

  async 'players.convertToCult'(playerId: string) {
    check(playerId, String);

    await Players.updateAsync(playerId, { $set: { role: Role.Cultist } });
  },

  async 'games.finishCultConversion'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = await Players.findOneAsync(playerId);
    if (!player || player.role !== Role.CultLeader) {
      throw new Meteor.Error('not-authorized', 'Only the cult leader can do this');
    }

    await Games.updateAsync(gameId, { $set: { gameState: GameState.RoleReveal } });
  },

  async 'games.finishRoleReveal'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    // Reset all players' ready status
    const allPlayers = await Players.find({ gameId }).fetchAsync();
    for (const p of allPlayers) {
      await Players.updateAsync(p._id!, { $set: { isReady: false } });
    }

    await Games.updateAsync(gameId, { $set: { gameState: GameState.InProgress } });
  },

  async 'games.newGameSamePlayers'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = await Players.findOneAsync(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can start a new game');
    }

    // Reset all players to initial state
    const allPlayers = await Players.find({ gameId }).fetchAsync();
    for (const p of allPlayers) {
      await Players.updateAsync(p._id!, {
        $set: {
          role: Role.None,
          isConvertEligible: false,
          gunCount: 0,
          isReady: false,
        },
      });
    }

    // Move to Waiting state so players can choose their roles
    await Games.updateAsync(gameId, { $set: { gameState: GameState.Waiting } });
  },

  async 'games.newGameDifferentPlayers'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = await Players.findOneAsync(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can start a new game');
    }

    const game = await Games.findOneAsync(gameId);
    if (!game) {
      throw new Meteor.Error('game-not-found', 'Game not found');
    }

    // Generate a new room code
    const roomCode = generateRoomCode();

    // Remove all non-host players
    const allPlayers = await Players.find({ gameId }).fetchAsync();
    for (const p of allPlayers) {
      if (!p.isHost) {
        await Players.removeAsync(p._id!);
      }
    }

    // Reset host player to initial state
    await Players.updateAsync(playerId, {
      $set: {
        role: Role.None,
        isConvertEligible: false,
        gunCount: 0,
        isReady: false,
      },
    });

    // Update game with new room code and reset to Setup state
    await Games.updateAsync(gameId, {
      $set: {
        roomCode,
        numberOfPlayers: 5, // Reset to default
        gameState: GameState.Setup,
        players: [playerId], // Only host remains
      },
    });

    return { roomCode };
  },
});
