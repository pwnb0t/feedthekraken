import { Mongo } from 'meteor/mongo';

export enum GameState {
  Setup = 'Setup',
  Waiting = 'Waiting',
  InProgress = 'InProgress',
  CultGunStashSetup = 'CultGunStashSetup',
  CultGunStashInProgress = 'CultGunStashInProgress',
  CultGunStashResults = 'CultGunStashResults',
  CultConversionSetup = 'CultConversionSetup',
  CultConversionInProgress = 'CultConversionInProgress',
  RoleReveal = 'RoleReveal',
  GameOver = 'GameOver',
}

export enum Role {
  None = 'None',
  Sailor = 'Sailor',
  Pirate = 'Pirate',
  CultLeader = 'CultLeader',
  Cultist = 'Cultist',
}

export interface Player {
  _id?: string;
  gameId: string;
  name: string;
  isHost: boolean;
  role: Role;
  isConvertEligible: boolean;
  gunCount: number;
  isReady: boolean;
}

export interface Game {
  _id?: string;
  roomCode: string;
  numberOfPlayers: number;
  gameState: GameState;
  players: string[]; // Player IDs
  createdAt: Date;
}

export const Games = new Mongo.Collection<Game>('games');
export const Players = new Mongo.Collection<Player>('players');
