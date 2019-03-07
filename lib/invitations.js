const uuid = require('node-uuid');

import { Meteor } from 'meteor/meteor';

Meteor.methods({
  acceptInvitation: function(invitationId) {
    check(invitationId, String);

    const team = Teams.findOne(
      {
        'invitations.token': {
          $in: [invitationId],
        },
      },
      { fields: { name: 1, owner: 1, slug: 1 } }
    );

    if (team) {
      Teams.update(team._id, {
        $pull: { invitations: { token: invitationId } },
        $push: { members: { _id: Meteor.userId() } },
      });
      if (Meteor.isClient) {
        return FlowRouter.go('/' + team.slug);
      } else {
        const userId = Meteor.userId();
        Meteor.setTimeout(function() {
          Email.send({
            from: 'team@siftie.com',
            to: userEmail(team.owner, userId),
            subject:
              userEmail(userId) +
              ' has accepted your invitation to join ' +
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
  },
  createInvitation: function(teamId, email) {
    check(teamId, String);
    check(email, String);

    const team = Teams.findOne(teamId);

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    const invitationToken = uuid.v4();

    const teamUpdate = Teams.update(teamId, {
      $push: {
        invitations: {
          token: invitationToken,
          email: email,
        },
      },
    });

    if (Meteor.isServer) {
      Meteor.setTimeout(function() {
        Email.send({
          from: 'team@siftie.com',
          to: email,
          subject: 'Invitation to join ' + team.name + ' on Siftie Reader.',
          text:
            "You've been invited to join " +
            team.name +
            ' on Siftie Reader.\n\n' +
            'Join the team: ' +
            Meteor.absoluteUrl() +
            'invite/' +
            invitationToken,
        });
      });
    }
  },
  deleteInvitation: function(teamId, invitationId) {
    check(teamId, String);
    check(invitationId, String);

    const team = Teams.findOne(teamId);

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    return Teams.update(teamId, {
      $pull: { invitations: { token: invitationId } },
    });
  },
  getInvitation: function(invitationId) {
    check(invitationId, String);

    const team = Teams.findOne(
      {
        'invitations.token': {
          $in: [invitationId],
        },
      },
      { fields: { name: 1, owner: 1, slug: 1 } }
    );

    if (team) {
      team.invitationId = invitationId;
    }

    return team;
  },
});
