import React from 'react';
import { Meteor } from 'meteor/meteor';

Notice = createReactClass({
  displayName: 'Notice',

  mixins: [ReactMeteorData],

  getMeteorData: function() {
    return {
      user: Meteor.user(),
    };
  },

  render: function() {
    if (this.data.user && this.data.user.profile) {
      if (_.contains(this.data.user.profile.noticesRead, this.props.id)) {
        return null;
      }
    }
    return <div className="notice-container">{this.props.children}</div>;
  },
});
