import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

ChannelHeader = createReactClass({
  displayName: 'ChannelHeader',

  propTypes: {
    channel: PropTypes.object,
    channelIsFirstInList: PropTypes.func,
    channelIsLastInList: PropTypes.func,
    popoverShown: PropTypes.string,
    popoverToggle: PropTypes.func,
    team: PropTypes.object,
  },

  getInitialState: function() {
    return {
      feedsModalShown: false,
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
    const menuStatus =
      this.props.popoverShown === 'channel-menu' ? '-open' : '';

    let permanentChannelIndicator;
    if (this.props.channel.slug === 'active') {
      permanentChannelIndicator = (
        <i className="icon ion-arrow-graph-up-right active-icon" />
      );
    } else if (this.props.channel.slug === 'curated') {
      permanentChannelIndicator = <i className="icon ion-heart active-icon" />;
    } else if (this.props.channel.slug === 'best') {
      permanentChannelIndicator = <i className="icon ion-star active-icon" />;
    }

    const prevChannelButtonInactive = this.props.channelIsFirstInList()
      ? '-inactive'
      : '';
    const nextChannelButtonInactive = this.props.channelIsLastInList()
      ? '-inactive'
      : '';

    let deleteChannel = (
      <ChannelDelete channel={this.props.channel} team={this.props.team} />
    );

    const manageFeeds = <a onClick={this.showFeedsModal}>Manage feeds</a>;

    let dropdownMenu;
    if (
      this.props.channel.slug !== 'active' &&
      this.props.channel.slug !== 'best' &&
      this.props.channel.slug !== 'curated'
    ) {
      dropdownMenu = (
        <div className={'dropdown-menu ' + menuStatus}>
          <i
            className="trigger icon ion-ios-settings-strong"
            onClick={this.toggleChannelMenu}
          />
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

    let curatedForm;
    if (this.props.channel.slug === 'curated') {
      curatedForm = <CuratedForm team={this.props.team} />;
    }

    return (
      <div>
        {feedsModal}
        <header className="channel-header">
          <div className="channel-header__title">
            <i
              className={
                'channel-nav -prev icon ion-chevron-left ' +
                prevChannelButtonInactive
              }
              onClick={keyBindings.prevChannel}
            />
            <i
              className={
                'channel-nav -next icon ion-chevron-right ' +
                nextChannelButtonInactive
              }
              onClick={keyBindings.nextChannel}
            />
            <h2>
              {permanentChannelIndicator} {this.props.channel.name}
            </h2>
          </div>
          {curatedForm}
          {dropdownMenu}
        </header>
      </div>
    );
  },
});
