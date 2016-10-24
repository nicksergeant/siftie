import React from 'react';
import { Meteor } from 'meteor/meteor';

InvitationCreate = React.createClass({

  displayName: 'InvitationCreate',

  propTypes: {
    team: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      email: ''
    };
  },

  handleChange: function() {
    this.setState({
      email: elem('email', this).value
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    if (!this.isValid()) {
      return Session.set('messages', [{
        type: 'error',
        message: 'Please enter an email.'
      }]);
    }

    Meteor.call('createInvitation', this.props.team._id, elem('email', this).value.trim(), (error) => {
      if (error) {
        Session.set('messages', [{ type: 'error', message: error.reason }]);
      } else {
        window.analytics.track('Invitation Created', {
          team: this.props.team.name
        });
        Session.set('messages', [{
          type: 'success',
          message: 'Invite sent.'
        }]);
      }
    });

    elem('email', this).focus();

    this.setState({
      email: ''
    });
  },

  isValid: function() {
    const email = elem('email', this).value.trim();
    return email !== '';
  },

  render: function() {
    return (
      <div className="invite-user">
        <h4>Invite team member:</h4>
        <form id="invite-member" onSubmit={this.handleSubmit}>
          <input
            className="text"
            onChange={this.handleChange}
            placeholder="Email"
            ref="email"
            required
            type="email"
            value={this.state.email}
          />
          <button type="submit">Invite</button>
        </form>
      </div>
    );
  }
});
