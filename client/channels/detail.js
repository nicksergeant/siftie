import PropTypes from 'prop-types';
import React from 'react';

ChannelDetail = createReactClass({
  displayName: 'ChannelDetail',

  propTypes: {
    channel: PropTypes.object,
    channelIsFirstInList: PropTypes.func,
    channelIsLastInList: PropTypes.func,
    children: PropTypes.element,
    className: PropTypes.string,
    focusInList: PropTypes.func,
    isDetail: PropTypes.bool,
    popoverShown: PropTypes.string,
    popoverToggle: PropTypes.func,
    team: PropTypes.object,
  },

  mixins: [ReactMeteorData],

  getMeteorData: function() {
    const channelLimit = Session.get(this.channelLimitKey());

    if (
      this.props.team &&
      this.props.channel &&
      ['active', 'best'].includes(this.props.channel.id)
    ) {
      const options =
        this.props.channel.id === 'best'
          ? {
              rating: { $gte: 3 },
            }
          : {};
      return {
        channelLimit: channelLimit,
        items: Items.find().fetch(),
        teamItems: TeamItems.find(
          {
            teamId: this.props.team._id,
            lastActiveDate: { $exists: true },
            ...options,
          },
          { limit: channelLimit, sort: { lastActiveDate: -1 } }
        ).fetch(),
        user: Meteor.user(),
      };
    } else {
      return {
        channelLimit: channelLimit,
        items: Items.find(
          {
            feedId: { $in: this.props.channel ? this.props.channel.feeds : [] },
          },
          { limit: channelLimit, sort: { pubDate: -1 } }
        ).fetch(),
        teamItems: TeamItems.find({
          channelId: this.props.channel.id,
        }).fetch(),
        user: Meteor.user(),
      };
    }
  },

  channelLimitKey: function() {
    let key;
    if (this.props.channel) {
      key = `$${this.props.team._id}-${this.props.channel.id}-limit`;
    }
    return key;
  },

  canShowLess: function() {
    return this.data.channelLimit > config.ITEMS_PER_PAGE;
  },

  canShowMore: function() {
    return this.data.channelLimit < config.MAX_CHANNEL_ITEMS;
  },

  getFirstItemUrl: function(items) {
    if (['active', 'best'].includes(this.props.channel.id)) {
      return (
        '/' +
        this.props.team.slug +
        `/${this.props.channel.id}/` +
        items[0].teamItemChannelId +
        '/' +
        items[0]._id
      );
    } else {
      return (
        '/' +
        this.props.team.slug +
        '/' +
        this.props.channel.slug +
        '/' +
        items[0]._id
      );
    }
  },

  loadLess: function() {
    Session.set(
      this.channelLimitKey(),
      this.data.channelLimit - config.ITEMS_PER_PAGE
    );
  },

  loadMore: function() {
    Session.set(
      this.channelLimitKey(),
      this.data.channelLimit + config.ITEMS_PER_PAGE
    );
  },

  processItems: function() {
    let items = this.data.items;

    if (['active', 'best'].includes(this.props.channel.id)) {
      let processedItems = this.data.teamItems.map(teamItem => {
        const found = _.findWhere(this.data.items, { _id: teamItem.itemId });
        if (found) {
          found.teamItemChannelId = teamItem.channelId;
        }
        return found;
      });
      items = _.compact(processedItems);
    }

    return items;
  },

  render: function() {
    let showMore;
    if (this.canShowMore()) {
      showMore = (
        <button className="load-more button -dark" onClick={this.loadMore}>
          <i className="icon ion-plus" />
          More
        </button>
      );
    }

    let showLess;
    if (this.canShowLess()) {
      showLess = (
        <button
          className="load-less  button -secondary"
          onClick={this.loadLess}
        >
          <i className="icon ion-minus" />
          Less
        </button>
      );
    }

    const items = this.processItems();

    if (
      items.length === this.data.channelLimit &&
      this.data.channelLimit <= config.ITEMS_PER_PAGE &&
      this.props.isDetail
    ) {
      Meteor.setTimeout(() => {
        this.props.focusInList();
      });
    }

    let pagination;
    if (items.length) {
      pagination = (
        <div className="posts-panel__pagination">
          {showLess}
          {showMore}
          <br />
          (showing {this.data.channelLimit})
        </div>
      );
    }

    let inner;
    if (
      (this.props.channel.feeds && this.props.channel.feeds.length) ||
      ['active', 'best'].includes(this.props.channel.id)
    ) {
      inner = (
        <div className="posts-panel">
          <div className="posts-panel__list">
            <ItemList
              channel={this.props.channel}
              items={items}
              team={this.props.team}
            />
          </div>
          {pagination}
        </div>
      );
    } else {
      inner = (
        <div className="posts-panel">
          <div className="tour-point tour-add-feed">
            Add a feed to this channel by clicking the menu icon, then "Manage
            feeds".
          </div>
        </div>
      );
    }

    return (
      <div className={this.props.className} onKeyDown={this.handleKeyDown}>
        <ChannelHeader
          channel={this.props.channel}
          channelIsFirstInList={this.props.channelIsFirstInList}
          channelIsLastInList={this.props.channelIsLastInList}
          popoverShown={this.props.popoverShown}
          popoverToggle={this.props.popoverToggle}
          team={this.props.team}
        />
        {inner}
        {this.props.children}
      </div>
    );
  },
});
