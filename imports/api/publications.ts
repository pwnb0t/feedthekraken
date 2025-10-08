import { Meteor } from 'meteor/meteor';
import { Games, Players } from './collections';

Meteor.publish('game', function (gameId: string) {
  return Games.find({ _id: gameId });
});

Meteor.publish('players', function (gameId: string) {
  return Players.find({ gameId });
});

Meteor.publish('player', function (playerId: string) {
  return Players.find({ _id: playerId });
});
