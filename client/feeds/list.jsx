import React from 'react';
import { Meteor } from 'meteor/meteor';

FeedList = React.createClass({

  displayName: 'FeedList',

  propTypes: {
    channel: React.PropTypes.object,
    team: React.PropTypes.object
  },

  mixins: [ReactMeteorData],

  getMeteorData: function() {
    return {
      feeds: Feeds.find().fetch()
    };
  },

  feeds: function() {
    return this.data.feeds.filter((feed) => {
      return _.contains(this.props.channel.feeds, feed._id);
    });
  },

  isOwner: function() {
    // return this.team ? this.team.owner === Meteor.userId() :
    //        Template.parentData().team.owner === Meteor.userId();
    return true;
  },

  render: function() {
    const feeds = this.feeds().map((feed) => {
      let deleteFeed;
      if (this.isOwner()) {
        deleteFeed = (
          <FeedDelete
            channel={this.props.channel}
            feed={feed}
            team={this.props.team}
          />
        );
      }
      return (
        <li className={'feeds__item' + (feed.error ? ' feed-error' : '')} key={feed._id} title={feed.error || ''}>
          <span>
            {deleteFeed}
            {feed.url}
          </span>
        </li>
      );
    });

    return (
      <div>
        <FeedCreate channel={this.props.channel} team={this.props.team} />
        <ul className="feeds">
          {feeds}
        </ul>
      </div>
    );
  }
});
