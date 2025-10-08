import { Meteor } from 'meteor/meteor';
import '/imports/api/methods';
import '/imports/api/publications';

Meteor.startup(() => {
  console.log('Feed the Kraken server started');
});
