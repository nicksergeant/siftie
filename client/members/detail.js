import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

MemberDetail = createReactClass({
  displayName: 'MemberDetail',

  propTypes: {
    userId: PropTypes.string,
  },

  mixins: [ReactMeteorData],

  getMeteorData: function() {
    return {
      user: Meteor.users.findOne(this.props.userId),
    };
  },

  render: function() {
    if (!this.data.user) return null;

    return <div>Email: {userEmail(this.data.user)}</div>;
  },
});
