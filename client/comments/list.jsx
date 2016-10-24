import React from 'react';

CommentList = React.createClass({

  displayName: 'CommentList',

  propTypes: {
    comments: React.PropTypes.array,
    team: React.PropTypes.object,
    teamItem: React.PropTypes.object
  },

  sorted: function() {
    return _(this.props.comments)
      .sortBy(function(value) {
        return new Date(value);
      })
      .value();
  },

  render: function() {
    const comments = this.sorted().map((comment) => {
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
        <ul>
          {comments}
        </ul>
      </div>
    );
  }

});
