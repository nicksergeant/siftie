import React from 'react';
import { Meteor } from 'meteor/meteor';

ChannelDelete = React.createClass({

  displayName: 'ChannelDelete',

  propTypes: {
    channel: React.PropTypes.object,
    team: React.PropTypes.object,
  },

  onClick: function(e) {
    if (confirm('Are you sure you want to delete this channel?')) {
      const channelName = this.props.channel.name;
      window.analytics.track('Channel Deleted', {
        name: channelName,
        team: this.props.team.name
      });
      e.preventDefault();
      FlowRouter.go('/' + this.props.team.slug);
      Meteor.call('deleteChannel', this.props.team._id, this.props.channel.id);
      Session.set('messages', [{
        type: 'success',
        message: 'Successfully deleted the "' + channelName + '" channel.'
      }]);
    }
  },

  render: function() {
    return (
      <a className="delete-channel"
        onClick={this.onClick}>
        <i className="icon ion-trash-b"></i> Delete channel
      </a>
    );
  }

});
