import React from 'react';
import { Meteor } from 'meteor/meteor';

ChannelList = React.createClass({

  displayName: 'ChannelList',

  propTypes: {
    channel: React.PropTypes.object,
    team: React.PropTypes.object
  },

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {};
  },

  getMeteorData: function() {
    return {
      items: Items.find().fetch(),
      user: Meteor.user()
    };
  },

  isActive: function(slug) {
    return FlowRouter.current().path.indexOf(`/${this.props.team.slug}/${slug}`) !== -1 ?
      'active' : '';
  },

  sorted: function() {
    if (!this.props.team.channels) return [];
    const sorted = _(this.props.team.channels)
      .map(function(channel) {
        channel.slug = channel.slug.toLowerCase();
        return channel;
      })
      .sortBy('name')
      .value();
    return sorted.filter((channel) => {
      return channel.slug !== 'curated';
    });
  },

  render: function() {
    const activeChannel = (
      <li className={'active-channel ' + this.isActive('active')}>
        <a href={'/' + this.props.team.slug + '/active'}>
          <i className="icon ion-ios-pulse-strong"></i>Active
        </a>
      </li>
    );

    const curatedChannel = (
      <li className={'curated-channel ' + this.isActive('curated')}>
        <a href={'/' + this.props.team.slug + '/curated'}>
          <i className="icon ion-star"></i>Curated
        </a>
      </li>
    );

    const channels = this.sorted().map((channel) => {
      const newestItemForChannel = _(this.data.items)
        .filter((item) => {
          return _.contains(channel.feeds, item.feedId);
        })
        .sortBy((item) => {
          return new Date(item.created);
        })
        .reverse()
        .value()[0];

      let classes = '';
      if (this.props.channel && this.props.channel.slug === channel.slug) {
        classes += 'active ';
      }

      if (this.data.user.profile && this.data.user.profile.channelsRead) {
        const readChannel = _.find(this.data.user.profile.channelsRead, { id: channel.id });

        if (readChannel && newestItemForChannel) {
          if (newestItemForChannel.created > readChannel.date) {
            classes += 'new-stuff ';
          }
        } else {
          classes += 'new-stuff ';
        }
      } else {
        classes += 'new-stuff ';
      }

      return (
        <li className={classes} key={channel.id}>
          <a
           href={'/' + this.props.team.slug + '/' + channel.slug}>
          {channel.name}
          </a>
        </li>
      );
    });

    return (
      <ul>
        {activeChannel}
        {curatedChannel}
        {channels}
      </ul>
    );
  }
});
