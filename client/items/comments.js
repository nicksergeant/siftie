import PropTypes from 'prop-types';
import React from 'react';

ItemComments = createReactClass({
  displayName: 'ItemComments',

  propTypes: {
    channel: PropTypes.object,
    item: PropTypes.object,
    team: PropTypes.object,
    teamItem: PropTypes.object,
  },

  render: function() {
    let commentCount;
    let commentList;

    if (this.props.teamItem && this.props.teamItem.comments.length) {
      commentCount = ' (' + this.props.teamItem.comments.length + ')';
      commentList = (
        <CommentList
          comments={this.props.teamItem.comments}
          team={this.props.team}
          teamItem={this.props.teamItem}
        />
      );
    }

    return (
      <div className="comments" id="comments">
        <h5 className="section-label">Comments{commentCount}</h5>
        {commentList}
        <CommentCreate
          channel={this.props.channel}
          item={this.props.item}
          team={this.props.team}
        />
      </div>
    );
  },
});
