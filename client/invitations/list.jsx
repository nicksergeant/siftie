import React from 'react';
import { Meteor } from 'meteor/meteor';

InvitationList = React.createClass({

  displayName: 'InvitationList',

  propTypes: {
    team: React.PropTypes.object
  },

  isOwner: function() {
    // return Meteor.userId() === Template.parentData().owner;
    return true;
  },

  gravatar: function(memberId) {
    const hash = new CryptoJS.MD5(userEmail(memberId)).toString();
    return `https://secure.gravatar.com/avatar/${hash}?s=50`;
  },

  render: function() {
    const invitations = this.props.team.invitations.map((invitation) => {
      let deleteInvitation;
      if (this.isOwner()) {
        deleteInvitation = (
          <InvitationDelete
            invitation={invitation}
            team={this.props.team}
          />
        );
      }
      return (
        <li key={invitation.token} className="members__item group">
          <span>
            <i className="avatar-placeholder icon ion-person"></i>
            <div className="details">
              {invitation.email}
            </div>
            {deleteInvitation}
          </span>
        </li>
      );
    });

    return (
      <ul className="members -pending">
        {invitations}
      </ul>
    );
  }
});
