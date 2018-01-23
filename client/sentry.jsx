import { Meteor } from 'meteor/meteor';

if (Meteor.absoluteUrl() === 'http://siftie.com/') {
  if (Meteor.isClient) {
    Meteor.startup(function() {
      const orig = Meteor._debug;
      Meteor._debug = function() {
        var buffer = _.reduce(arguments, function(memo, arg) {
          return memo + ' ' + arg;
        }, '');
        var err = new Error(buffer);
        orig.apply(Meteor, arguments);
      };
    });
  }
}
