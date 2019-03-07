import { Meteor } from 'meteor/meteor';

Meteor.startup(function() {
  Accounts.onCreateUser(function(options, newUser) {
    if (options.profile) {
      newUser.profile = options.profile;
    }
    Meteor.setTimeout(function() {
      const user = Meteor.users.findOne(newUser._id);
      if (user) {
        Accounts.sendVerificationEmail(user._id);
      }
    }, 2 * 1000);
    return newUser;
  });
});
