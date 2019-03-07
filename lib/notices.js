import { Meteor } from 'meteor/meteor';

Meteor.methods({
  markNoticeAsRead: function(noticeId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const user = Meteor.user();

    if (user.profile && user.profile.noticesRead) {
      if (_.contains(user.profile.noticesRead, noticeId)) return true;
    }

    if (user.profile && user.profile.noticesRead) {
      Meteor.users.update(
        { _id: user._id },
        {
          $push: {
            'profile.noticesRead': noticeId,
          },
        },
        { upsert: true }
      );
    } else {
      Meteor.users.update(
        { _id: user._id },
        {
          $set: {
            'profile.noticesRead': [noticeId],
          },
        },
        { upsert: true }
      );
    }
  },
});
