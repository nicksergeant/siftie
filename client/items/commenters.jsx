import React from 'react';

ItemCommenters = React.createClass({
  displayName: 'ItemCommenters',

  propTypes: {
    teamItem: React.PropTypes.object,
  },

  render: function() {
    const { teamItem } = this.props;
    if (!teamItem) {
      return null;
    }
    const avatars = teamItem.comments.map(comment => {
      return (
        <img
          className="commenter-avatar"
          key={comment.user}
          src={userAvatar(comment.user)}
        />
      );
    });
    return (
      <div className="commenters">
        <i className="icon ion-ios-chatbubble" />
        {avatars}
      </div>
    );
  },
});
