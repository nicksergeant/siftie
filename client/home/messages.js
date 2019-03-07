import React from 'react';
import { Meteor } from 'meteor/meteor';

Messages = createReactClass({
  displayName: 'Messages',

  mixins: [ReactMeteorData],

  getMeteorData: function() {
    Session.setDefault('messages', []);
    return {
      messages: Session.get('messages'),
    };
  },

  dismiss: function() {
    Session.set('messages', []);
  },

  render: function() {
    const messages = this.data.messages.map(function(message) {
      return (
        <p className={'alert ' + message.type} key={message.message}>
          {message.message} <a className="dismiss">dismiss</a>
        </p>
      );
    });

    if (messages.length) {
      Meteor.setTimeout(
        function() {
          this.dismiss();
        }.bind(this),
        5000
      );
    }

    return <div onClick={this.dismiss}>{messages}</div>;
  },
});
