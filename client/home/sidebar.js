import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

Sidebar = createReactClass({
  displayName: 'Sidebar',

  propTypes: {
    channel: PropTypes.object,
    popoverHide: PropTypes.func,
    popoverShown: PropTypes.string,
    popoverToggle: PropTypes.func,
    team: PropTypes.object,
    teams: PropTypes.array,
    user: PropTypes.object,
  },

  getInitialState: function() {
    return {
      addChannelModalShown: false,
      channelsOpen: true,
    };
  },

  isActive: function(slug) {
    return FlowRouter.current().path.indexOf(
      `/${this.props.team.slug}/${slug}`
    ) !== -1
      ? 'active'
      : '';
  },

  hideTeamMenu: function(e) {
    analytics.track('Team Menu Toggled', {
      channel: this.props.channel ? this.props.channel.name : null,
      team: this.props.team.name,
    });
    e.stopPropagation();
    this.props.popoverHide('sidebar-team-selector');
  },

  toggleChannels: function() {
    analytics.track('Channel Sidebar Toggled', {
      channelsOpen: !this.state.channelsOpen,
      channel: this.props.channel ? this.props.channel.name : null,
      team: this.props.team.name,
    });
    this.setState({ channelsOpen: !this.state.channelsOpen });
    Meteor.setTimeout(() => {
      $('body').toggleClass('channels-hidden');
    });
  },

  toggleTeamMenu: function(e) {
    analytics.track('Team Menu Toggled', {
      channel: this.props.channel ? this.props.channel.name : null,
      team: this.props.team.name,
    });
    e.stopPropagation();
    this.props.popoverToggle('sidebar-team-selector');
  },

  showAddChannelModal: function() {
    this.setState({ addChannelModalShown: true });
  },

  showUserSettingsModal: function() {
    this.setState({ userSettingsModalShown: true });
  },

  hideAddChannelModal: function() {
    this.setState({ addChannelModalShown: false });
  },

  hideUserSettingsModal: function() {
    this.setState({ userSettingsModalShown: false });
  },

  render: function() {
    let channelList;
    let team;

    let iconClass = this.state.channelsOpen
      ? 'ion-arrow-left-c'
      : 'ion-arrow-right-c';

    const menuStatus =
      this.props.popoverShown === 'sidebar-team-selector' ? '-open' : '';

    if (!this.props.team) return null;

    teamSelector = (
      <div className={'team-selector dropdown-menu ' + menuStatus}>
        <a className="trigger" onClick={this.toggleTeamMenu}>
          <i className="icon ion-ios-people -team-icon" />
          {this.props.team.name}
          <i className="icon ion-chevron-down -chevron" />
        </a>
        <nav className="menu">
          <TeamList
            activeTeam={this.props.team.name}
            onClick={this.hideTeamMenu}
            teams={this.props.teams}
          />
          <a href="/signup">
            <span className="plus-button">➕</span>Create new team
          </a>
        </nav>
      </div>
    );
    channelList = (
      <ChannelList
        channel={this.props.channel}
        team={this.props.team}
        toggleChannels={this.toggleChannels}
      />
    );

    const teamNav = (
      <nav className="channel-panel__list">
        <h3 className="section-label">Team</h3>
        <ul>
          <li className={this.isActive('members')}>
            <a href={'/' + this.props.team.slug + '/members'}>
              <i className="icon ion-person-stalker" />
              Members
            </a>
          </li>
          <li className={this.isActive('settings')}>
            <a href={'/' + this.props.team.slug + '/settings'}>
              <i className="icon ion-gear-a" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    );

    collapsedNav = (
      <nav className="collapsed-nav">
        <a className="nav-item">
          <i
            className="icon ion-pound -channels"
            onClick={this.toggleChannels}
          />
          <span className="label">Channels</span>
        </a>
        <a className="nav-item" href={'/' + this.props.team.slug + '/members'}>
          <i className="icon ion-person-stalker -members" />
          <span className="label">Members</span>
        </a>
        <a className="nav-item" href={'/' + this.props.team.slug + '/settings'}>
          <i className="icon ion-gear-a -settings" />
          <span className="label">Settings</span>
        </a>
      </nav>
    );

    let addChannelModal = (
      <Modal
        channel={this.props.channel}
        component={ChannelCreate}
        modalStatus={this.state.addChannelModalShown}
        modalTitle="Add a Channel"
        onClose={this.hideAddChannelModal}
        team={this.props.team}
      />
    );

    const addChannelButton = (
      <i
        className="add-channel icon ion-plus-round"
        onClick={this.showAddChannelModal}
      />
    );

    let userSettingsModal = (
      <Modal
        component={UserSettings}
        modalStatus={this.state.userSettingsModalShown}
        modalTitle="My Account"
        onClose={this.hideUserSettingsModal}
      />
    );

    const dismissNotice = function(key) {
      Meteor.call('markNoticeAsRead', key);
    };

    let notices = (
      <div className="notices-container">
        <Notice id="download-mac-app-0.0.6">
          <div className="bottom-channel-panel-notice">
            On a Mac? <span>🍎</span>
            <a
              target="_blank"
              href="https://download.siftie.com/Siftie-0.0.4.dmg"
            >
              Download the Siftie OS X app (v0.0.4)
            </a>
            <a
              className="close"
              onClick={dismissNotice.bind(this, 'download-mac-app-0.0.6')}
            >
              <i className="close icon ion-close-round" />
            </a>
          </div>
        </Notice>
      </div>
    );

    return (
      <div className="channel-panel">
        {addChannelModal}
        {userSettingsModal}
        <header className="channel-panel__header">
          <a className="logo" href="/">
            <img alt="" src="/img/logo.png" />
          </a>
          <i
            className={'panel-toggle icon ' + iconClass}
            onClick={this.toggleChannels}
          />
        </header>
        <div className="channel-panel__body">
          {teamSelector}
          <nav className="channel-panel__list">
            <h3 className="section-label">Channels {addChannelButton}</h3>
            {channelList}
          </nav>
          {teamNav}
          {notices}
        </div>
        {collapsedNav}
        <UserCard
          showUserSettingsModal={this.showUserSettingsModal}
          user={this.props.user}
        />
      </div>
    );
  },
});
