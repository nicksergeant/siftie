import { Meteor } from 'meteor/meteor';

Meteor.startup(function() {
  const smtp = {
    username: process.env.POSTMARK_API_KEY,
    password: process.env.POSTMARK_API_KEY,
    server: 'smtp.postmarkapp.com',
    port: 587,
  };

  process.env.MAIL_URL =
    'smtp://' +
    encodeURIComponent(smtp.username) +
    ':' +
    encodeURIComponent(smtp.password) +
    '@' +
    encodeURIComponent(smtp.server) +
    ':' +
    smtp.port;

  Accounts.emailTemplates.from = 'Siftie Reader <team@siftie.com>';
  Accounts.emailTemplates.siteName = 'Siftie Reader';
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return '[Siftie Reader] Confirm your email';
  };
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Please confirm your email by visiting ' + url;
  };
});
