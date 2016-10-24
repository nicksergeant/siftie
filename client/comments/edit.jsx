import React from 'react';
import { Meteor } from 'meteor/meteor';

CommentEdit = React.createClass({

  displayName: 'CommentEdit',

  propTypes: {
    comment: React.PropTypes.object,
    onDone: React.PropTypes.func,
    teamItem: React.PropTypes.object
  },

  handleKeyDown: function(e) {
    if (e.which === 13 && e.metaKey) {
      e.preventDefault();
      this.handleSubmit(e);
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    Meteor.call('saveComment',
      this.props.teamItem._id,
      this.props.comment.id,
      elem('new-comment', this).value
    );
    this.props.onDone();
  },

  render: function() {
    return (
      <div className="comment__editing">
        <form className="edit-comment group" onSubmit={this.handleSubmit}>
          <textarea
            defaultValue={this.props.comment.comment}
            onKeyDown={this.handleKeyDown}
            ref="new-comment"
          >
          </textarea>
          <button className="button" type="submit">Save</button>
          <a className="cancel-link" href="" onClick={this.props.onDone}>Cancel</a>
        </form>
      </div>
    );
  }

});
