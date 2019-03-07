import { Meteor } from 'meteor/meteor';

Meteor.methods({
  markItemAsRead: function(userId, itemId) {

    check(itemId, String);
    check(userId, String);

    const user = Meteor.users.findOne(userId);

    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    if (user.profile && user.profile.itemsRead) {
      if (_.contains(user.profile.itemsRead, itemId)) return true;
    }

    Meteor.users.update({ _id: user._id }, {
      $push: {
        'profile.itemsRead': itemId
      }
    }, { upsert: true });

  }
});
