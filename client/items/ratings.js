import PropTypes from 'prop-types';
import React from 'react';

ItemRatings = createReactClass({
  displayName: 'ItemRatings',

  propTypes: {
    channel: PropTypes.object,
    item: PropTypes.object,
    team: PropTypes.object,
    teamItem: PropTypes.object,
  },

  render: function() {
    return (
      <div>
        <hr />
        <ItemAverageRating detail teamItem={this.props.teamItem} />
        <ItemUserRating
          channel={this.props.channel}
          item={this.props.item}
          team={this.props.team}
          teamItem={this.props.teamItem}
        />
      </div>
    );
  },
});
