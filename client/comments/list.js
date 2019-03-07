import PropTypes from 'prop-types';
import React from 'react';

CommentList = createReactClass({
  displayName: 'CommentList',

  propTypes: {
    comments: PropTypes.array,
    team: PropTypes.object,
    teamItem: PropTypes.object,
  },

  sorted: function() {
    return _(this.props.comments)
      .sortBy(function(value) {
        return new Date(value);
      })
      .value();
  },

  render: function() {
    const comments = this.sorted().map(comment => {
      return (
        <CommentDetail
          comment={comment}
          key={comment.id}
          team={this.props.team}
          teamItem={this.props.teamItem}
        />
      );
    });
    return (
      <div>
        <ul>{comments}</ul>
      </div>
    );
  },
});
