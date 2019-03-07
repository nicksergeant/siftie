import { Meteor } from 'meteor/meteor';

Slack = {
  notify: function(text, slackWebhookUrl) {
    if (Meteor.absoluteUrl() === 'https://reader.siftie.com/') {
      HTTP.post(slackWebhookUrl, {
        data: {
          username: 'Siftie Reader',
          text: text,
          icon_url: 'https://siftie.s3.amazonaws.com/icon.png',
        },
      });
    }
  },
};
