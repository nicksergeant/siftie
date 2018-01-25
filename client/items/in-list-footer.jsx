import React from 'react';

ItemInListFooter = React.createClass({
  displayName: 'ItemInListFooter',

  propTypes: {
    teamItem: React.PropTypes.object,
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
