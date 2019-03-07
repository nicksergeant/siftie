const uuid  = require('node-uuid');

Meteor.methods({
  resetPasswordWithToken: function(resetPasswordToken, newPassword) {
    const user = Meteor.users.findOne({
      'resetPasswordToken': resetPasswordToken
    })
    if (user) {
      Accounts.setPassword(user._id, newPassword);
    }
  },
  requestNewPassword: function(email) {
    const user = Meteor.users.findOne({
      'emails.0.address': email
    })
    if (user) {
      const email = userEmail(user._id);
      const resetPasswordToken = uuid.v4();

      Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          'resetPasswordToken': resetPasswordToken
        }
      });

      Email.send({
        from: 'team@siftie.com',
        to: email,
        subject: 'Password reset request on Siftie Reader.',
        text: `Someone (hopefully you) has requested that your password be reset for reader.siftie.com.
          If you would like to reset your password, click the following link:

          ${Meteor.absoluteUrl() + 'forgot-password/' + resetPasswordToken}

          If you feel this request has been made in error, you may safely disregard this message.`
      });
    }
  },
  updateUser: function(updates) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'profile.name': updates.name
      }
    });
  }
});
