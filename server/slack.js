import { Meteor } from 'meteor/meteor';

Slack = {
  notify: function(text, slackWebhookUrl) {
    if (Meteor.absoluteUrl() === 'https://siftie.com/') {
      HTTP.post(slackWebhookUrl, {
        data: {
          username: 'Siftie',
          text: text,
          icon_url: 'https://siftie.s3.amazonaws.com/icon.png',
        },
      });
    }
  },
};
