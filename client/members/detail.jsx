import React from 'react';
import { Meteor } from 'meteor/meteor';

MemberDetail = React.createClass({

  displayName: 'MemberDetail',

  propTypes: {
    userId: React.PropTypes.string
  },

  mixins: [ReactMeteorData],

  getMeteorData: function() {
    return {
      user: Meteor.users.findOne(this.props.userId)
    };
  },

  render: function() {
    if (!this.data.user) return null;

    return (
      <div>
        Email: {userEmail(this.data.user)}
      </div>
    );
  }
});
