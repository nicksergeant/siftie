const uuid  = require('node-uuid');

import { Meteor } from 'meteor/meteor';

Meteor.methods({
  createChannel: function(teamId, name) {
    check(teamId, String);
    check(name, String);

    const team = Teams.findOne(teamId);

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }
    
    const channelId = uuid.v4();

    let channelSlug = name.replace(/\W/g, '-').toLowerCase();

    if (_.find(team.channels, { slug: channelSlug })) {
      const salt = Math.random().toString(16).substring(2);
      channelSlug = channelSlug + '-' + salt;
    }

    Teams.update(teamId, {
      $push: { channels: {
        id: channelId,
        name: name,
        slug: channelSlug,
        createdAt: new Date(),
        feeds: []
      }}
    });

    return channelSlug;
  },
  deleteChannel: function(teamId, channelId) {
    check(channelId, String);

    const team = Teams.findOne(teamId);

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    return Teams.update(teamId, {
      $pull: { channels: { id: channelId }}
    });
  },
  markChannelAsRead: function(userId, channelId) {

    check(channelId, String);
    check(userId, String);

    const user = Meteor.users.findOne(userId);

    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    if (user.profile.channelsRead && _.find(user.profile.channelsRead, { id: channelId })) {
      Meteor.users.update({ _id: user._id, 'profile.channelsRead.id': channelId }, {
        $set: {
          'profile.channelsRead.$.date': new Date()
        }
      });
    } else if (user.profile.channelsRead) {
      Meteor.users.update({ _id: user._id }, {
        $push: {
          'profile.channelsRead': {
            id: channelId,
            date: new Date()
          }
        }
      });
    } else if (!user.profile.channelsRead) {
      Meteor.users.update({ _id: user._id }, {
        $set: {
          'profile.channelsRead': [{
            id: channelId,
            date: new Date()
          }]
        }
      });
    }

  }
});
