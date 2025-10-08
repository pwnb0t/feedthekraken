import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games, Players, GameState, Role } from './collections';
import { generateRoomCode } from '../utils/roomCode';

Meteor.methods({
  'games.create'(playerName: string) {
    check(playerName, String);

    const roomCode = generateRoomCode();
    const gameId = Games.insert({
      roomCode,
      numberOfPlayers: 5,
      gameState: GameState.Setup,
      players: [],
      createdAt: new Date(),
    });

    const playerId = Players.insert({
      gameId,
      name: playerName,
      isHost: true,
      role: Role.None,
      isConvertEligible: false,
      gunCount: 0,
    });

    Games.update(gameId, { $push: { players: playerId } });

    return { gameId, playerId, roomCode };
  },

  'games.join'(roomCode: string, playerName: string) {
    check(roomCode, String);
    check(playerName, String);

    const game = Games.findOne({ roomCode });
    if (!game) {
      throw new Meteor.Error('game-not-found', 'Game not found');
    }

    // Check if player already exists in this game
    const existingPlayer = Players.findOne({ gameId: game._id!, name: playerName });
    if (existingPlayer) {
      return { gameId: game._id!, playerId: existingPlayer._id!, roomCode: game.roomCode };
    }

    // Create new player
    const playerId = Players.insert({
      gameId: game._id!,
      name: playerName,
      isHost: false,
      role: Role.None,
      isConvertEligible: false,
      gunCount: 0,
    });

    Games.update(game._id!, { $push: { players: playerId } });

    return { gameId: game._id!, playerId, roomCode: game.roomCode };
  },

  'games.setNumberOfPlayers'(gameId: string, playerId: string, numberOfPlayers: number) {
    check(gameId, String);
    check(playerId, String);
    check(numberOfPlayers, Number);

    const player = Players.findOne(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can change this');
    }

    if (numberOfPlayers < 5 || numberOfPlayers > 11) {
      throw new Meteor.Error('invalid-number', 'Number of players must be between 5 and 11');
    }

    Games.update(gameId, { $set: { numberOfPlayers } });
  },

  'games.startWaitingRoom'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = Players.findOne(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can start the waiting room');
    }

    Games.update(gameId, { $set: { gameState: GameState.Waiting } });
  },

  'players.setRole'(playerId: string, role: Role) {
    check(playerId, String);
    check(role, String);

    Players.update(playerId, { $set: { role } });
  },

  'games.startGame'(gameId: string, playerId: string) {
    check(gameId, String);
    check(playerId, String);

    const player = Players.findOne(playerId);
    if (!player || !player.isHost) {
      throw new Meteor.Error('not-authorized', 'Only the host can start the game');
    }

    Games.update(gameId, { $set: { gameState: GameState.InProgress } });
  },
});
