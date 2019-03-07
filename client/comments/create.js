import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

CommentCreate = createReactClass({
  displayName: 'CommentCreate',

  propTypes: {
    channel: PropTypes.object,
    item: PropTypes.object,
    team: PropTypes.object,
  },

  getInitialState: function() {
    return {
      comment: '',
    };
  },

  handleChange: function() {
    this.setState({
      comment: elem('comment', this).value,
    });
  },

  handleKeyDown: function(e) {
    if (e.which === 13 && e.metaKey) {
      e.preventDefault();
      this.handleSubmit(e);
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();

    if (!this.isValid()) {
      return Session.set('messages', [
        {
          type: 'error',
          message: 'Please enter a comment.',
        },
      ]);
    }

    Meteor.call(
      'createComment',
      this.props.item._id,
      this.props.team._id,
      this.props.channel.id,
      elem('comment', this).value.trim(),
      error => {
        window.analytics.track('Comment Created', {
          channel: this.props.channel.name,
          team: this.props.team.name,
        });
        if (error) {
          Session.set('messages', [{ type: 'error', message: error.reason }]);
        }
      }
    );

    this.setState({
      comment: '',
    });
  },

  isValid: function() {
    const comment = elem('comment', this).value.trim();
    return comment !== '';
  },

  render: function() {
    return (
      <div>
        <form
          className="comments__create group"
          id="new-comment"
          onKeyDown={this.handleKeyDown}
          onSubmit={this.handleSubmit}
        >
          <textarea
            className="text"
            onChange={this.handleChange}
            placeholder="Type comment here"
            ref="comment"
            required
            style={{ width: '100%' }}
            value={this.state.comment}
          />
          <button type="submit">Post</button>
        </form>
      </div>
    );
  },
});
