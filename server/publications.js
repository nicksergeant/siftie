import { Meteor } from 'meteor/meteor';

Meteor.publishComposite('teams', {
  find: function() {
    return Teams.find(
      { $or: [{ 'members._id': this.userId }, { owner: this.userId }] },
      { fields: {} }
    );
  },
  children: [
    // Members
    {
      find: function(team) {
        const memberIds = team.members.map(function(member) {
          return member._id;
        });

        return Meteor.users.find(
          { $or: [{ _id: team.owner }, { _id: { $in: memberIds || [] } }] },
          {
            fields: {
              emails: 1,
              profile: 1,
            },
          }
        );
      },
    },

    // Feeds
    {
      find: function(team) {
        return Feeds.find(
          {
            _id: {
              $in: _(team.channels)
                .pluck('feeds')
                .flatten()
                .value(),
            },
          },
          { fields: {} }
        );
      },
    },
  ],
});

Meteor.publishComposite('items', function(options) {
  const userTeamIds = [];

  return {
    find: function() {
      let limit = parseInt(options.limit);
      if (!limit || isNaN(limit) || limit > config.MAX_CHANNEL_ITEMS) {
        limit = config.ITEMS_PER_PAGE;
      }

      return Items.find(
        { feedId: { $in: options.feeds || [] } },
        {
          limit: limit,
          sort: { pubDate: -1 },
        }
      );
    },
    children: [
      // TeamItems
      {
        find: function(item) {
          const teams = Teams.find(
            { $or: [{ 'members._id': this.userId }, { owner: this.userId }] },
            { fields: { _id: 1 } }
          );

          teams.forEach(function(team) {
            userTeamIds.push(team._id);
          });

          return TeamItems.find({
            itemId: item._id,
            teamId: { $in: userTeamIds },
          });
        },
      },
    ],
  };
});

Meteor.publishComposite('itemsActive', function(options) {
  return {
    find: function() {
      let limit = parseInt(options.limit);
      if (!limit || isNaN(limit) || limit > config.MAX_CHANNEL_ITEMS) {
        limit = config.ITEMS_PER_PAGE;
      }

      return TeamItems.find(
        {
          teamId: options.teamId,
          lastActiveDate: { $exists: true },
        },
        {
          limit: limit,
          sort: { lastActiveDate: -1 },
        }
      );
    },
    children: [
      {
        find: function(teamItem) {
          return Items.find({
            _id: teamItem.itemId,
          });
        },
      },
    ],
  };
});

Meteor.publishComposite('item', function(options) {
  const userTeamIds = [];

  return {
    find: function() {
      const teams = Teams.find(
        { $or: [{ 'members._id': this.userId }, { owner: this.userId }] },
        { fields: { _id: 1 } }
      );

      teams.forEach(function(team) {
        userTeamIds.push(team._id);
      });

      const teamForItem = Teams.find(
        {
          slug: options.teamSlug,
          $or: [{ 'members._id': this.userId }, { owner: this.userId }],
        },
        { fields: { channels: 1 } }
      ).fetch();

      const channel = _(teamForItem[0].channels).find({
        slug: options.channelSlug,
      });

      if (options.itemId) {
        Meteor.call('markItemAsRead', this.userId, options.itemId);
      }

      if (channel) {
        Meteor.call('markChannelAsRead', this.userId, channel.id);
      }

      return Items.find({
        _id: new Meteor.Collection.ObjectID(options.itemId),
      });
    },
    children: [
      {
        find: function(item) {
          return TeamItems.find({
            itemId: item._id,
            teamId: { $in: userTeamIds },
          });
        },
      },
    ],
  };
});
