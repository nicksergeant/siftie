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
    const {
      channel,
      channelIsFirstInList,
      channelIsLastInList,
      team,
    } = this.props;

    const menuStatus =
      this.props.popoverShown === 'channel-menu' ? '-open' : '';

    let permanentChannelIndicator;
    if (channel.slug === 'active') {
      permanentChannelIndicator = (
        <i className="icon ion-arrow-graph-up-right active-icon" />
      );
    } else if (channel.slug === 'curated') {
      permanentChannelIndicator = <i className="icon ion-heart active-icon" />;
    } else if (channel.slug === 'best') {
      permanentChannelIndicator = <i className="icon ion-star active-icon" />;
    }

    let channelRssLink;
    if (['active', 'best', 'curated'].includes(channel.slug)) {
      channelRssLink = (
        <a href={`/${team.slug}/${channel.slug}/rss`} target="_blank">
          <i
            className="icon ion-social-rss"
            style={{ color: '#f26522', float: 'right' }}
          />
        </a>
      );
    }

    const prevChannelButtonInactive = channelIsFirstInList() ? '-inactive' : '';
    const nextChannelButtonInactive = channelIsLastInList() ? '-inactive' : '';

    let deleteChannel = <ChannelDelete channel={channel} team={team} />;

    const manageFeeds = <a onClick={this.showFeedsModal}>Manage feeds</a>;

    let dropdownMenu;
    if (
      channel.slug !== 'active' &&
      channel.slug !== 'best' &&
      channel.slug !== 'curated'
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
        channel={channel}
        component={FeedList}
        modalStatus={this.state.feedsModalShown}
        modalTitle="Manage Feeds"
        onClose={this.hideFeedsModal}
        team={team}
      />
    );

    let curatedForm;
    if (channel.slug === 'curated') {
      curatedForm = <CuratedForm team={team} />;
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
              {permanentChannelIndicator} {channel.name}
            </h2>
          </div>
          {dropdownMenu}
          {curatedForm}
          {channelRssLink}
        </header>
      </div>
    );
  },
});
