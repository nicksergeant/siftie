const uuid = require('node-uuid');

import { Meteor } from 'meteor/meteor';

Meteor.methods({
  createRating: function(itemId, teamId, channelId, rating) {
    check(itemId, Meteor.Collection.ObjectID);
    check(teamId, String);
    check(channelId, String);
    check(rating, Number);

    const team = Teams.findOne({ _id: teamId });
    const userId = Meteor.userId();
    const channel = _.find(team.channels, { id: channelId });
    const item = Items.findOne({ _id: itemId });

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

    const existingRating = _.find(teamItem.ratings, {
      user: userId,
    });

    if (existingRating) {
      TeamItems.update(
        {
          _id: teamItem._id,
          'ratings.id': existingRating.id,
        },
        {
          $set: {
            lastActiveDate: new Date(),
            'ratings.$.rating': rating,
          },
        }
      );
    } else {
      TeamItems.update(teamItem, {
        $set: { lastActiveDate: new Date() },
        $push: {
          ratings: {
            id: uuid.v4(),
            createdAt: new Date(),
            user: userId,
            rating: rating,
          },
        },
      });
    }

    teamItem = TeamItems.findOne({
      itemId: itemId,
      teamId: teamId,
      channelId: channelId,
    });

    if (teamItem.ratings.length) {
      const ratings = _(teamItem.ratings).pluck('rating');
      const avgFloat = ratings.sum() / ratings.value().length;
      const avgRating = Math.round(avgFloat * 1) / 1;

      TeamItems.update(
        {
          _id: teamItem._id,
        },
        {
          $set: {
            rating: avgRating,
          },
        }
      );
    }

    const stars = ':star:'.repeat(rating);

    if (Meteor.isServer) {
      if (team.slackWebhookUrl) {
        Slack.notify(
          userEmail(userId) +
            ' just rated ' +
            '<' +
            Meteor.absoluteUrl() +
            team.slug +
            '/' +
            channel.slug +
            '/' +
            item._id +
            '|' +
            item.title +
            '>:\n' +
            '> ' +
            stars,
          team.slackWebhookUrl
        );
      }
    }
  },
});
