import React from 'react';
import { Meteor } from 'meteor/meteor';

ItemInList = React.createClass({

  displayName: 'ItemInList',

  propTypes: {
    channel: React.PropTypes.object,
    item: React.PropTypes.object,
    team: React.PropTypes.object
  },

  mixins: [ReactMeteorData],

  getMeteorData: function() {
    return {
      teamItem: TeamItems.findOne({
        itemId: this.props.item._id,
        teamId: this.props.team._id,
        channelId: this.props.channel.id !== 'active' ?
          this.props.channel.id :
          this.props.item.teamItemChannelId
      })
    };
  },

  classes: function() {
    let classes = [];

    const user = Meteor.user();

    if (!this.props.item || !user.profile || !user.profile.itemsRead) return classes;

    const isRead = _.contains(Meteor.user().profile.itemsRead, this.props.item._id._str);
    const isActive = FlowRouter.current().params.itemId === this.props.item._id._str;

    classes.push(isActive || isRead ? '-read' : '');
    classes.push(isActive ? '-active' : '');

    return classes;
  },

  itemPreview: function() {
    return {
      __html: `${this.props.item.preview}...` || ''
    };
  },

  onClick: function(e) {
    e.preventDefault();
    $('section.channel-container').get(0).scrollIntoView();
    FlowRouter.go(this.url());
  },

  pubDateTimeago: function() {
    return moment(this.props.item.pubDate).fromNow();
  },

  pubDateString: function() {
    return this.props.item.pubDate.toISOString();
  },

  url: function() {
    if (this.props.channel.id === 'active') {
      return '/' +
        this.props.team.slug + '/active/' +
        this.props.item.teamItemChannelId + '/' +
        this.props.item._id;
    } else {
      return '/' +
        this.props.team.slug + '/' +
        this.props.channel.slug + '/' +
        this.props.item._id;
    }
  },

  render: function() {
    let activeChannelName;
    if (this.props.item.teamItemChannelId) {
      const matchedChannel = _.find(this.props.team.channels, { id: this.props.item.teamItemChannelId });
      if (matchedChannel) {
        activeChannelName = (
          <span className="post-channel">{matchedChannel.name}</span>
        );
      }
    }

    return (
      <article className={'post ' + this.classes().join(' ')}
        id={'id-' + this.props.item._id}
        onClick={this.onClick}>
        <header className="post__header">
          <div className="timestamp">
            <span className="post-source">
              {this.props.item.feedTitle}
            </span>
            <span className="post-date"
              data-livestamp={this.pubDateString()}>
              {this.pubDateTimeago()}
            </span>
          </div>
          {activeChannelName}
          <a><h1>{this.props.item.title}</h1></a>
        </header>
        <div className="post__body"
          dangerouslySetInnerHTML={this.itemPreview()}
        />
        <ItemInListFooter teamItem={this.data.teamItem} />
      </article>
    );
  }
});
