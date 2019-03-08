import PropTypes from 'prop-types';
import React from 'react';

ItemList = createReactClass({
  displayName: 'ItemList',

  propTypes: {
    channel: PropTypes.object,
    items: PropTypes.array,
    team: PropTypes.object,
  },

  render: function() {
    const items = this.props.items.map(item => {
      return (
        <ItemInList
          channel={this.props.channel}
          item={item}
          key={item.id}
          team={this.props.team}
        />
      );
    });

    if (items.length) {
      return <div>{items}</div>;
    } else {
      if (this.props.channel.id === 'active') {
        return (
          <div style={{ padding: '20px' }}>
            Items will appear here once someone on your team either rates or
            comments on an item.
          </div>
        );
      } else if (this.props.channel.id === 'best') {
        return (
          <div style={{ padding: '20px' }}>
            Items will appear here once someone on your team rates an item 3
            stars or higher.
          </div>
        );
      } else if (this.props.channel.id === 'curated') {
        return (
          <div style={{ padding: '20px' }}>
            Share a link with the form above and it'll appear here.
          </div>
        );
      } else {
        return (
          <div style={{ padding: '20px' }}>
            Items will appear here once your feeds are crawled.
          </div>
        );
      }
    }
  },
});
