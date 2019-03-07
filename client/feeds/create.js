import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

FeedCreate = createReactClass({
  displayName: 'FeedCreate',

  propTypes: {
    channel: PropTypes.object,
    team: PropTypes.object,
  },

  getInitialState: function() {
    return {
      url: '',
    };
  },

  handleChange: function() {
    this.setState({
      url: elem('url', this).value,
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    if (!this.isValid()) {
      return Session.set('messages', [
        {
          type: 'error',
          message: 'Please enter a URL.',
        },
      ]);
    }

    const feedUrl = elem('url', this).value;

    Meteor.call('createFeed', feedUrl, (error, result) => {
      if (error) {
        Session.set('messages', [{ type: 'error', message: error.reason }]);
      } else {
        window.analytics.track('Feed Created', {
          url: feedUrl,
          channel: this.props.channel.name,
          team: this.props.team.name,
        });
        Meteor.call(
          'subscribeFeed',
          result,
          this.props.team._id,
          this.props.channel.id,
          subError => {
            if (subError) {
              Session.set('messages', [
                { type: 'error', message: subError.reason },
              ]);
            } else {
              Session.set('messages', [
                {
                  type: 'success',
                  message: 'Your feed was created successfully.',
                },
              ]);
            }
          }
        );
        Meteor.call('crawlFeed', result);
      }
    });

    elem('url', this).focus();

    this.setState({
      url: '',
    });
  },

  isValid: function() {
    const url = elem('url', this).value.trim();
    return url !== '';
  },

  render: function() {
    return (
      <div>
        <form className="add-feed" id="new-feed" onSubmit={this.handleSubmit}>
          <input
            className="text"
            onChange={this.handleChange}
            placeholder="Enter feed URL"
            ref="url"
            required
            type="url"
            value={this.state.url}
          />
          <button type="submit">Add Feed</button>
        </form>
      </div>
    );
  },
});
