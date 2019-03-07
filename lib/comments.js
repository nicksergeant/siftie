const uuid = require('node-uuid');

import { Meteor } from 'meteor/meteor';

Meteor.methods({
  createComment: function(itemId, teamId, channelId, comment) {
    check(itemId, Meteor.Collection.ObjectID);
    check(teamId, String);
    check(channelId, String);
    check(comment, String);

    const team = Teams.findOne({ _id: teamId });
    const channel = _.findWhere(team.channels, { id: channelId });
    const item = Items.findOne({ _id: itemId });
    const userId = Meteor.userId();

    const allMembers = team.members
      .concat({ _id: team.owner })
      .map(function(teamMember) {
        return Meteor.users.findOne(teamMember._id);
      });

    let teamItem = TeamItems.findOne({
      itemId: itemId,
      teamId: teamId,
      channelId: channelId,
    });

    if (!teamItem) {
      teamItem = TeamItems.insert({
        itemId: itemId,
        teamId: teamId,
        channelId: channelId,
        ratings: [],
        comments: [],
      });
    }

    TeamItems.update(teamItem, {
      $set: { lastActiveDate: new Date() },
      $push: {
        comments: {
          id: uuid.v4(),
          createdAt: new Date(),
          user: userId,
          comment: comment,
        },
      },
    });

    if (Meteor.isServer) {
      if (team.slackWebhookUrl) {
        Slack.notify(
          userEmail(userId) +
            ' just commented on ' +
            '<' +
            Meteor.absoluteUrl() +
            team.slug +
            '/' +
            channel.slug +
            '/' +
            item._id +
            '|' +
            item.title +
            '> ' +
            'and said:\n' +
            '> ' +
            comment,
          team.slackWebhookUrl
        );
      }
    }
  },
  saveComment: function(teamItemId, commentId, newComment) {
    check(commentId, String);
    check(newComment, String);
    check(teamItemId, String);

    TeamItems.update(
      {
        _id: teamItemId,
        'comments.id': commentId,
      },
      {
        $set: { lastActiveDate: new Date() },
        $set: {
          'comments.$.comment': newComment,
        },
      }
    );
  },
});
