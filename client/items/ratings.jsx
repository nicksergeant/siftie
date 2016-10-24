import React from 'react';

ItemRatings = React.createClass({

  displayName: 'ItemRatings',

  propTypes: {
    channel: React.PropTypes.object,
    item: React.PropTypes.object,
    team: React.PropTypes.object,
    teamItem: React.PropTypes.object
  },

  render: function() {
    return (
      <div>
        <hr />
        <ItemAverageRating
          detail
          teamItem={this.props.teamItem}
        />
        <ItemUserRating
          channel={this.props.channel}
          item={this.props.item}
          team={this.props.team}
          teamItem={this.props.teamItem}
        />
      </div>
    );
  }

});
