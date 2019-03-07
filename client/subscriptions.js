import { Meteor } from 'meteor/meteor';

Meteor.subscribe('teams');

Tracker.autorun(function() {
  const teams = Teams.find();
  teams.forEach(function(team) {
    if (team.channels) {
      team.channels.forEach(function(channel) {
        const channelLimit = `$${team._id}-${channel.id}-limit`;
        Session.setDefault(channelLimit, config.ITEMS_PER_PAGE);
        Meteor.subscribe('items', {
          feeds: channel.feeds,
          limit: Session.get(channelLimit),
        });
      });
    }

    const activeChannelLimit = `$${team._id}-active-limit`;
    Session.setDefault(activeChannelLimit, config.ITEMS_PER_PAGE);
    Meteor.subscribe('itemsActive', {
      teamId: team._id,
      limit: Session.get(activeChannelLimit),
    });
  });
});
