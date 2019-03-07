import { Meteor } from 'meteor/meteor';

Meteor.methods({
  subscribeFeed: function(feedId, teamId, channelId) {

    check(feedId, String);
    check(teamId, String);
    check(channelId, String);

    const team = Teams.findOne(teamId);

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    return Teams.update({
      _id: teamId,
      'channels.id': channelId
    }, {
      $push: {
        'channels.$.feeds': feedId
      }
    });

  },
  unsubscribeFeed: function(feedId, teamId, channelId) {

    check(feedId, String);
    check(teamId, String);
    check(channelId, String);

    const team = Teams.findOne(teamId);

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    return Teams.update({
      _id: teamId,
      'channels.id': channelId
    }, {
      $pull: {
        'channels.$.feeds': feedId
      }
    });


  }
});
