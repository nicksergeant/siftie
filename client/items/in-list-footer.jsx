import PropTypes from 'prop-types';
import React from 'react';

ItemInListFooter = createReactClass({
  displayName: 'ItemInListFooter',

  propTypes: {
    teamItem: PropTypes.object,
  },

  render: function() {
    return (
      <div className="post__footer group">
        <ItemAverageRating teamItem={this.props.teamItem} />
        <ItemCommenters teamItem={this.props.teamItem} />
      </div>
    );
  },
});
