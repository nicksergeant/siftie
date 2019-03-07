import React from 'react';
import { Meteor } from 'meteor/meteor';

UserSettings = createReactClass({

  displayName: 'UserSettings',

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    }
  },

  getMeteorData: function() {
    return {
      user: Meteor.user()
    }
  },

  handleChange: function() {
    this.setState({
      oldPassword: elem('old-password', this).value,
      newPassword: elem('new-password', this).value,
      newPasswordConfirmation: elem('new-password-confirmation', this).value
    });
  },

  updateUser: function(e) {
    e.preventDefault();
    const name = elem('name', this).value;
    Meteor.call('updateUser', {
      name: name
    });
    Session.set('messages', [{
      type: 'success',
      message: 'Profile updated successfully.'
    }]);
  },

  changePassword: function(e) {
    e.preventDefault();

    if (this.state.newPassword !== this.state.newPasswordConfirmation) {
      return Session.set('messages', [{ type: 'error', message: 'Passwords do not match.' }]);
    }

    Accounts.changePassword(this.state.oldPassword, this.state.newPassword, (err) => {
      if (err) {
        Session.set('messages', [{
          type: 'error',
          message: `Error: ${ err.reason }.`
        }]);
      } else {
        Session.set('messages', [{
          type: 'success',
          message: 'New password saved succesfully.'
        }]);

        this.setState({
          oldPassword: '',
          newPassword: '',
          newPasswordConfirmation: ''
        });
      }
    });
  },

  render: function() {
    if (!this.data.user) return null;
    return (
      <div>
          <form id="user-update" onSubmit={this.updateUser}>
            <label>
              <strong>Name:</strong>
              <input
                className="text"
                defaultValue={this.data.user.profile? this.data.user.profile.name : ''}
                placeholder="Your name"
                ref="name"
                type="text"
              />
            </label>
            <button type="submit">Save</button>
          </form>
          <h4 style={{ marginTop: '40px' }}>Change password:</h4>
          <form id="password-update" onSubmit={this.changePassword}>
            <label>
              <strong>Old password:</strong>
              <input
                className="text"
                onChange={this.handleChange}
                placeholder="Current password"
                ref="old-password"
                required
                type="password"
                value={this.state.oldPassword}
              />
            </label>
            <label>
              <strong>New password:</strong>
              <input
                className="text"
                onChange={this.handleChange}
                placeholder="New password"
                ref="new-password"
                required
                type="password"
                value={this.state.newPassword}
              />
            </label>
            <label>
              <strong>Confirm new password:</strong>
              <input
                className="text"
                onChange={this.handleChange}
                placeholder="New password confirmation"
                ref="new-password-confirmation"
                required
                type="password"
                value={this.state.newPasswordConfirmation}
              />
            </label>
            <button type="submit">Save</button>
          </form>
      </div>
    );
  }

});
