import { Meteor } from 'meteor/meteor';

const extend = function(child, parent) {
  for (var key in parent) {
    if (hasProp.call(parent, key)) child[key] = parent[key];
  }
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};
const hasProp = {}.hasOwnProperty;

Slack = {
  notify: function(text, slackWebhookUrl) {
    if (Meteor.absoluteUrl() === 'http://siftie.com/') {
      return Job.push(new SlackJob({
        text: text,
        slackWebhookUrl: slackWebhookUrl
      }));
    }
  }
};

SlackJob = (function(superClass) {
  extend(SlackJob, superClass);

  function SlackJob() {
    return SlackJob.__super__.constructor.apply(this, arguments);
  }

  SlackJob.prototype.handleJob = function() {
    return HTTP.post(this.params.slackWebhookUrl, {
      data: {
        username: 'Siftie',
        text: this.params.text,
        icon_url: 'http://i.nick.sg/image/0o433R110Q2a/mGM0x2RQ.png'
      }
    });
  };

  SlackJob.prototype.afterJob = function(error) {
    if (error) {
      RavenLogger.log(error);
    }
  };

  return SlackJob;
})(Job);
