import React from 'react';
import { Meteor } from 'meteor/meteor';

MemberList = React.createClass({

  displayName: 'MemberList',

  propTypes: {
    team: React.PropTypes.object
  },

  mixins: [ReactMeteorData],

  getMeteorData: function() {
    let owner = {};
    if (this.props.team) {
      const ownerUser = Meteor.users.findOne(this.props.team.owner);
      if (ownerUser) {
        owner = {
          _id: ownerUser._id,
          email: ownerUser.emails[0].address
        };
      }
    }

    let members;
    if (this.props.team) {
      members = this.props.team.members.map(function(teamMember) {
        if (teamMember) {
          const memberUser = Meteor.users.findOne(teamMember._id);
          if (memberUser) {
            return {
              _id: memberUser._id,
              email: memberUser.emails[0].address
            };
          }
        }
      });
    }

    return {
      members: members,
      owner: owner
    };
  },

  isOwner: function() {
    // return Meteor.userId() === Template.parentData().owner;
    return true;
  },

  regenerateTeamInviteKey: function(e) {
    e.preventDefault();
    Meteor.call('regenerateTeamInviteKey', this.props.team._id);
  },

  gravatar: function(memberId) {
    const hash = new CryptoJS.MD5(userEmail(memberId)).toString();
    return `https://secure.gravatar.com/avatar/${hash}?s=50`;
  },

  render: function() {
    let members;
    if (this.data.members) {
      members = _.compact(this.data.members).map((member) => {
        let deleteMember;
        if (this.isOwner()) {
          deleteMember = <MemberDelete member={member} team={this.props.team} />;
        }
        return (
          <li key={member._id} className="members__item group">
            <img className="avatar" src={this.gravatar(member._id)} />
            <div className="details">
              <a href={'/' + this.props.team.slug + '/members/' + member._id}>
                {userName(member._id)}
              </a>
            </div>
            {deleteMember}
          </li>
        );
      });
    }

    let invitations;
    if (this.props.team.invitations.length) {
      invitations = <InvitationList team={this.props.team} />;
    }

    return (
      <div className="settings-container">
        <h1>Team Members</h1>
        <ul className="members">
          <li className="members__item group">
            <img className="avatar" src={this.gravatar(this.data.owner._id)} />
            <div className="details">
              <a href={'/' + this.props.team.slug + '/members/' + this.data.owner._id}>{userName(this.data.owner._id)}</a>   (owner)
            </div>
          </li>
          {members}
        </ul>
        {invitations}

        <InvitationCreate team={this.props.team} />
        <p>
          Team Join Key:
          <code style={{display: 'inline-block', margin: '0 5px'}}>{this.props.team.inviteKey}</code>
          <a onClick={this.regenerateTeamInviteKey}>Regenerate &raquo;</a>
          <br />
          Shareable link: <a href={Meteor.absoluteUrl() + 'join/' + this.props.team.inviteKey}>
            {Meteor.absoluteUrl() + 'join/' + this.props.team.inviteKey}
            </a>
        </p>
      </div>
    );
  }

});
