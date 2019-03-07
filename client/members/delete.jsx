import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

MemberDelete = createReactClass({

  displayName: 'MemberDelete',

  propTypes: {
    member: PropTypes.object,
    team: PropTypes.object
  },

  onClick: function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this member?')) {
      window.analytics.track('Member Deleted', {
        team: this.props.team.name
      });
      Meteor.call('deleteMember', this.props.team._id, this.props.member._id);
    }
  },

  render: function() {
    return (
      <a className="delete delete-member"
         onClick={this.onClick}><i className="icon ion-close-round"></i></a>
    );
  }

});
