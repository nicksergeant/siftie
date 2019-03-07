import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

ResetPassword = createReactClass({
  displayName: 'ResetPassword',

  propTypes: {
    resetPasswordToken: PropTypes.string,
  },

  getInitialState: function() {
    return {
      newPassword: '',
      newPasswordConfirmation: '',
    };
  },

  handleChange: function() {
    this.setState({
      newPassword: elem('new-password', this).value,
      newPasswordConfirmation: elem('new-password-confirmation', this).value,
    });
  },

  changePassword: function(e) {
    e.preventDefault();

    if (this.state.newPassword !== this.state.newPasswordConfirmation) {
      return Session.set('messages', [
        { type: 'error', message: 'Passwords do not match.' },
      ]);
    }

    Meteor.call(
      'resetPasswordWithToken',
      this.props.resetPasswordToken,
      this.state.newPassword,
      err => {
        if (err) {
          Session.set('messages', [
            {
              type: 'error',
              message: `Error: ${err.reason}.`,
            },
          ]);
        } else {
          Session.set('messages', [
            {
              type: 'success',
              message: 'New password saved succesfully.',
            },
          ]);

          this.setState({
            newPassword: '',
            newPasswordConfirmation: '',
          });
        }
      }
    );
  },

  render: function() {
    return (
      <div>
        <Messages />
        <h4 style={{ marginTop: '40px' }}>Reset password:</h4>
        <form id="password-update" onSubmit={this.changePassword}>
          <input
            className="text"
            onChange={this.handleChange}
            placeholder="New password"
            ref="new-password"
            required
            type="password"
            value={this.state.newPassword}
          />
          <br />
          <input
            className="text"
            onChange={this.handleChange}
            placeholder="New password confirmation"
            ref="new-password-confirmation"
            required
            type="password"
            value={this.state.newPasswordConfirmation}
          />
          <br />
          <button type="submit">Save</button>
        </form>
      </div>
    );
  },
});
