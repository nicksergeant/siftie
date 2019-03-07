import PropTypes from 'prop-types';
import React from 'react';

ItemCommenters = createReactClass({
  displayName: 'ItemCommenters',

  propTypes: {
    teamItem: PropTypes.object,
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
        {avatars.length ? <i className="icon ion-ios-chatbubble" /> : null}
        {avatars}
      </div>
    );
  },
});
