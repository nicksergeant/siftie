import React from 'react';
import { Meteor } from 'meteor/meteor';

ChannelHeader = React.createClass({

  displayName: 'ChannelHeader',

  propTypes: {
    channel: React.PropTypes.object,
    channelIsFirstInList: React.PropTypes.func,
    channelIsLastInList: React.PropTypes.func,
    popoverShown: React.PropTypes.string,
    popoverToggle: React.PropTypes.func,
    team: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      feedsModalShown: false
    };
  },

  hideFeedsModal: function() {
    this.setState({ feedsModalShown: false });
  },

  showFeedsModal: function() {
    this.setState({ feedsModalShown: true });
  },

  isOwner: function() {
    return this.props.team.owner === Meteor.userId();
  },

  toggleChannelMenu: function(e) {
    e.stopPropagation();
    this.props.popoverToggle('channel-menu');
  },

  render: function() {
    const menuStatus = this.props.popoverShown === 'channel-menu' ? '-open' : '';

    let permanentChannelIndicator;
    if (this.props.channel.slug === 'active') {
      permanentChannelIndicator = <i className="icon ion-arrow-graph-up-right active-icon"></i>;
    } else if (this.props.channel.slug === 'curated') {
      permanentChannelIndicator = <i className="icon ion-star active-icon"></i>;
    }

    const prevChannelButtonInactive = this.props.channelIsFirstInList() ? '-inactive' : '';
    const nextChannelButtonInactive = this.props.channelIsLastInList() ? '-inactive' : '';

    let deleteChannel = <ChannelDelete channel={this.props.channel} team={this.props.team} />;

    const manageFeeds = (
      <a onClick={this.showFeedsModal}>
        Manage feeds
      </a>
    );

    let dropdownMenu;
    if (this.props.channel.slug !== 'active') {
      dropdownMenu = (
        <div className={'dropdown-menu ' + menuStatus}>
          <i
            className="trigger icon ion-ios-settings-strong"
            onClick={this.toggleChannelMenu}></i>
          <nav className="menu">
            {manageFeeds}
            {deleteChannel}
          </nav>
        </div>
      );
    }

    const feedsModal = (
      <Modal
        channel={this.props.channel}
        component={FeedList}
        modalStatus={this.state.feedsModalShown}
        modalTitle="Manage Feeds"
        onClose={this.hideFeedsModal}
        team={this.props.team}
      />
    );

    return (
      <div>
        {feedsModal}
        <header className="channel-header">
          <div className="channel-header__title">
            <i
              className={'channel-nav -prev icon ion-chevron-left ' + prevChannelButtonInactive}
              onClick={keyBindings.prevChannel}>
            </i>
            <i
              className={'channel-nav -next icon ion-chevron-right ' + nextChannelButtonInactive}
              onClick={keyBindings.nextChannel}>
            </i>
            <h2>{permanentChannelIndicator} {this.props.channel.name}</h2>
          </div>
          {dropdownMenu}
        </header>
      </div>
    );
  }
});
