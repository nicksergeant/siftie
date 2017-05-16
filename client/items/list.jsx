import React from 'react';

ItemList = React.createClass({

  displayName: 'ItemList',

  propTypes: {
    channel: React.PropTypes.object,
    items: React.PropTypes.array,
    team: React.PropTypes.object
  },

  render: function() {
    const items = this.props.items.map((item) => {
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
      return (
        <div>
          {items}
        </div>
      );
    } else {
      if (this.props.channel.id === 'active') {
        return (
          <div style={{ padding: '20px' }}>
            Items will appear here once someone on your team either rates or comments on an item.
          </div>
        );
      } else if (this.props.channel.id === 'curated') {
        return (
          <div style={{ padding: '20px' }}>
            Curated functionality coming soon!
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
  }

});
