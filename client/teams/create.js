import React from 'react';
import { Meteor } from 'meteor/meteor';

TeamCreate = createReactClass({
  displayName: 'TeamCreate',

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

    Meteor.call('createTeam', teamName, document.location.hostname, error => {
      if (error) {
        Session.set('messages', [{ type: 'error', message: error.reason }]);
      } else {
        window.analytics.track('Team Created', {
          name: teamName,
        });
        Session.set('messages', [
          {
            type: 'success',
            message: 'Your team was created successfully.',
          },
        ]);
      }
    });

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
      <div>
        <h5>Create new team:</h5>
        <form id="new-team" onSubmit={this.handleSubmit}>
          <input
            className="text"
            onChange={this.handleChange}
            placeholder="Team name"
            ref="name"
            required
            type="text"
            value={this.state.name}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    );
  },
});
