import React from 'react';
import { Meteor } from 'meteor/meteor';

FeedDelete = React.createClass({

  displayName: 'FeedDelete',

  propTypes: {
    channel: React.PropTypes.object,
    feed: React.PropTypes.object,
    team: React.PropTypes.object
  },

  onClick: function(e) {
    if (confirm('Are you sure you want to delete this feed?')) {
      e.preventDefault();
      Meteor.call('unsubscribeFeed',
                  this.props.feed._id,
                  this.props.team._id,
                  this.props.channel.id,
                  (error, result) => {
        if (!error) {
          window.analytics.track('Feed Deleted', {
            url: this.props.feed.url,
            channel: this.props.channel.name,
            team: this.props.team.name
          });
          Session.set('messages', [{
            message: 'Successfully deleted the "' + this.props.feed.url + '" feed.',
            type: 'success'
          }]);
        }
      });
    }
  },

  render: function() {
    return (
      <i className="close icon ion-close-round delete-feed" onClick={this.onClick}></i>
    );
  }

});
