const uuid = require('node-uuid');

import { Meteor } from 'meteor/meteor';

Meteor.methods({
  acceptTeamJoin: function(teamJoin) {
    check(teamJoin, Object);

    const userId = Meteor.userId();

    let team;
    let joined;

    if (teamJoin.joinKey) {
      team = Teams.findOne({
        inviteKey: teamJoin.joinKey,
      });
    }

    if (team) {
      if (!_.contains(team.members, { _id: userId })) {
        Teams.update(team._id, {
          $push: { members: { _id: userId } },
        });
        joined = true;
      }

      if (Meteor.isClient) {
        return FlowRouter.go('/' + team.slug);
      } else {
        if (joined) {
          Meteor.setTimeout(function() {
            Email.send({
              from: 'team@siftie.com',
              to: userEmail(team.owner, userId),
              subject:
                userName(userId) +
                ' has joined ' +
                team.name +
                ' on Siftie Reader.',
              text:
                'Congrats! Visit your team here: ' +
                Meteor.absoluteUrl() +
                team.slug,
            });
          });
        }
      }
    }
  },
  createTeam: function(name, hostname) {
    check(name, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    let teamSlug = name.replace(/\W/g, '-').toLowerCase();

    if (Teams.findOne({ slug: teamSlug })) {
      throw new Meteor.Error(
        'team-slug-unavailable',
        'Team username is not available. Please choose another.'
      );
    }

    const teamId = Teams.insert({
      name: name,
      slug: teamSlug,
      invitations: [],
      inviteKey: uuid.v4(),
      members: [],
      createdAt: new Date(),
      owner: Meteor.userId(),
    });

    Meteor.call('createChannel', teamId, 'Curated', 'curated');

    const curatedFeedUrl = `${Meteor.absoluteUrl()}${teamSlug}/curated/rss`;
    const feedId = Meteor.call('createFeed', curatedFeedUrl);

    Meteor.call('subscribeFeed', feedId, teamId, 'curated');

    return teamId;
  },
  deleteTeam: function(teamId) {
    check(teamId, String);

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    return Teams.remove(teamId);
  },
  getTeamJoinKey: function(keyId) {
    check(keyId, String);

    const team = Teams.findOne(
      {
        inviteKey: keyId,
      },
      { fields: { name: 1, owner: 1, slug: 1 } }
    );

    if (team) {
      team.joinKey = keyId;
      return team;
    }

    return false;
  },
  regenerateTeamInviteKey: function(teamId) {
    const team = Teams.findOne(teamId);

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    Teams.update(
      {
        _id: team._id,
      },
      {
        $set: {
          inviteKey: uuid.v4(),
        },
      }
    );
  },
  updateTeam: function(teamId, updates) {
    Teams.update(teamId, {
      $set: updates,
    });
  },
});
