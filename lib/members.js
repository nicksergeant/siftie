import { Meteor } from 'meteor/meteor';

Meteor.methods({
  deleteMember: function(teamId, memberId) {
    check(memberId, String);
    check(teamId, String);

    const team = Teams.findOne({ _id: teamId });

    if (!team) {
      throw new Meteor.Error('team-not-found');
    }

    // if (!Meteor.userId() || Meteor.userId() !== team.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    Teams.update(team._id, {
      $pull: { members: { _id: memberId } },
    });

    if (Meteor.isServer) {
      const userId = Meteor.userId();
      Meteor.setTimeout(function() {
        Email.send({
          from: 'team@siftie.com',
          to: userEmail(memberId, userId),
          subject: 'Removed from ' + team.name + ' on Siftie',
          text:
            'You have been removed from the ' +
            team.name +
            ' team on Siftie.\n\n' +
            'If you feel this action has been made in error, please contact the team owner.',
        });
      });
    }
  },
});
