import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

SignupTeam = createReactClass({
  displayName: 'SignupTeam',

  propTypes: {
    switchToTab: PropTypes.func,
  },

  getInitialState: function() {
    return {
      name: '',
    };
  },

  handleChange: function() {
    this.setState({
      name: elem('name', this).value,
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    if (!this.isValid()) {
      return Session.set('messages', [
        {
          type: 'error',
          message: 'Please enter a name.',
        },
      ]);
    }

    const teamName = elem('name', this).value.trim();

    Meteor.call(
      'createTeam',
      teamName,
      document.location.hostname,
      (error, teamId) => {
        if (error) {
          Session.set('messages', [{ type: 'error', message: error.reason }]);
        } else {
          analytics.track('Team Created', {
            name: teamName,
          });
          Meteor.setTimeout(() => {
            this.props.switchToTab('done', { teamSlug: '' });
          });
        }
      }
    );

    elem('name', this).focus();

    this.setState({
      name: '',
    });
  },

  isValid: function() {
    const name = elem('name', this).value.trim();
    return name !== '';
  },

  render: function() {
    return (
      <div className="fill -signup">
        <div className="marketing-page signup group">
          <div className="signup__sidebar">
            <a className="logo" href="/" />
            <h1>Create an account name</h1>
          </div>
          <div className="signup__forms">
            <ol className="progress-indicators">
              <li>•</li>
              <li className="-active">•</li>
            </ol>
            <form id="new-team" onSubmit={this.handleSubmit}>
              <label className="field">
                <strong className="field__label">
                  Account name (group, family, team name, etc.)
                </strong>
                <input
                  className="text"
                  onChange={this.handleChange}
                  placeholder="Account name"
                  ref="name"
                  required
                  type="text"
                  value={this.state.name}
                />
              </label>

              <footer>
                <button className="-right" type="submit">
                  Create Account
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    );
  },
});
