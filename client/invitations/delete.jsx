import React from 'react';
import { Meteor } from 'meteor/meteor';

InvitationDelete = React.createClass({

  displayName: 'InvitationDelete',

  propTypes: {
    invitation: React.PropTypes.object,
    team: React.PropTypes.object
  },

  onClick: function(e) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this invitation?')) {
      window.analytics.track('Invitation Deleted', {
        team: this.props.team.name
      });
      Meteor.call('deleteInvitation', this.props.team._id, this.props.invitation.token);
    }
  },

  render: function() {
    return (
      <a className="delete delete-invitation"
         onClick={this.onClick}><i className="icon ion-close-round"></i></a>
    );
  }

});
