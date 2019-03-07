import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

ChannelCreate = createReactClass({

  displayName: 'ChannelCreate',

  propTypes: {
    closeModal: PropTypes.func,
    team: PropTypes.object,
  },

  getInitialState: function() {
    return {
      name: ''
    };
  },

  handleChange: function() {
    this.setState({
      name: elem('name', this).value
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    if (!this.isValid()) {
      return Session.set('messages', [{
        type: 'error',
        message: 'Please enter a name.'
      }]);
    }

    const channelName = elem('name', this).value.trim();

    Meteor.call('createChannel', this.props.team._id, channelName, (error, channelSlug) => {
      if (error) {
        Session.set('messages', [{ type: 'error', message: error.reason }]);
      } else {
        window.analytics.track('Channel Created', {
          name: channelName,
          team: this.props.team.name
        });
        Session.set('messages', [{
          type: 'success',
          message: 'Your channel was created successfully.'
        }]);
        Meteor.setTimeout(() => {
          FlowRouter.go('/' + this.props.team.slug + '/' + channelSlug);
        });
      }
    });

    elem('name', this).focus();

    this.setState({
      name: ''
    });
  },

  isValid: function() {
    const name = elem('name', this).value.trim();
    return name !== '';
  },

  render: function() {
    return (
      <div>
        <h5>Create new channel:</h5>
        <form id="new-channel" onSubmit={this.handleSubmit}>
          <input
            className="text"
            onChange={this.handleChange}
            placeholder="Channel name"
            ref="name"
            required
            type="text"
            value={this.state.name}
          />
          <button onClick={this.props.closeModal} type="submit">Create</button>
        </form>
      </div>
    );
  }
});
