import { Meteor } from 'meteor/meteor';

Meteor.methods({
  crawlFeed: function(feedId) {
    if (Meteor.isServer) {
      HTTP.get(
        'https://feeds.siftie.com/' +
          process.env.FEEDIE_KEY +
          '/crawl/' +
          feedId
      );
    }
  },
  createFeed: function(url) {
    check(url, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const existingFeed = Feeds.findOne({ url: url });

    if (existingFeed) {
      return existingFeed._id;
    }

    return Feeds.insert({
      createdAt: new Date(),
      owner: Meteor.userId(),
      url: url,
    });
  },
  deleteFeed: function(feedId) {
    check(feedId, String);

    const feed = Feeds.findOne(feedId);

    // if (!Meteor.userId() || Meteor.userId() !== feed.owner) {
    //   throw new Meteor.Error('not-authorized');
    // }

    return Feeds.remove(feedId);
  },
});
