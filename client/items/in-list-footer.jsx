import React from 'react';

ItemInListFooter = React.createClass({

  displayName: 'ItemInListFooter',

  propTypes: {
    teamItem: React.PropTypes.object
  },

  render: function() {
    let commentCount;

    if (this.props.teamItem && this.props.teamItem.comments.length) {
      commentCount = (
        <div className="comment-count">
          <i className="icon ion-ios-chatbubble"></i> {this.props.teamItem.comments.length}
        </div>
      );
    }

    return (
      <div className="post__footer group">
        <ItemAverageRating teamItem={this.props.teamItem} />
        {commentCount}
      </div>
    );
  }

});
