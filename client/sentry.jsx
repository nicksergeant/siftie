import { Meteor } from 'meteor/meteor';

if (Meteor.absoluteUrl() === 'http://siftie.com/') {
  Meteor.autorun(function() {
    var user = Meteor.user();
    if (!user) {
      Raven.setUser();
    } else {
      Raven.setUser({
        id: user._id,
        email: userEmail(user)
      });
    }
  });

  if (Meteor.isClient) {
    Meteor.startup(function() {
      const orig = Meteor._debug;
      Meteor._debug = function() {
        var buffer = _.reduce(arguments, function(memo, arg) {
          return memo + ' ' + arg;
        }, '');
        var err = new Error(buffer);
        Raven.captureException.call(Raven, err);
        orig.apply(Meteor, arguments);
      };
    });
  }
}
