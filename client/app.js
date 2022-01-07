import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';



let analyticsInitialized = false;

App = createReactClass({
  displayName: 'App',

  propTypes: {
    channelSlug: PropTypes.string,
    itemId: PropTypes.string,
    resetPasswordToken: PropTypes.string,
    teamItemChannelId: PropTypes.string,
    teamSlug: PropTypes.string,
    token: PropTypes.string,
    userId: PropTypes.string,
  },

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      popoverShown: '',
    };
  },

  getMeteorData: function() {
    if (
      !analyticsInitialized &&
      Meteor.absoluteUrl() === 'https://siftie.com/'
    ) {
      const user = Meteor.user();
      analyticsInitialized = true;
      if (user) {
        analytics.identify(user._id, {
          email: userEmail(user),
        });
      }
    }

    return {
      teams: Meteor.user()
        ? Teams.find({}, { sort: { createdAt: -1 } }).fetch()
        : [],
      user: Meteor.user(),
    };
  },

  popoverHide: function(name, e) {
    this.setState({
      popoverShown: '',
    });
  },

  popoverToggle: function(name, e) {
    if (this.state.popoverShown !== name) {
      analytics.track('Popover Shown', {
        name: name,
        channel: this.getChannel() ? this.getChannel().name : null,
        team: this.getTeam().name,
      });
    }
    this.setState({
      popoverShown: this.state.popoverShown === name ? '' : name,
    });
  },

  getChannel: function() {
    let channel;
    if (
      this.props.channelSlug &&
      this.props.teamSlug &&
      this.data.teams.length
    ) {
      const team = this.getTeam();
      if (team) {
        if (this.props.channelSlug === 'active') {
          channel = {
            id: 'active',
            slug: 'active',
            name: 'Active',
            feeds: [],
          };
        } else if (this.props.channelSlug === 'best') {
          channel = {
            id: 'best',
            slug: 'best',
            name: 'Best',
            feeds: [],
          };
        } else {
          const matches = team.channels.filter(c => {
            return c.slug === this.props.channelSlug;
          });
          if (matches.length) {
            channel = matches[0];
          }
        }
      }
    }
    return channel;
  },

  channelIsFirstInList: function() {
    return $('.channel-panel__list li.active').prev('li').length === 0;
  },

  channelIsLastInList: function() {
    return $('.channel-panel__list li.active').next('li').length === 0;
  },

  getTeam: function() {
    let team;
    if (this.props.teamSlug && this.data.teams.length) {
      const matches = this.data.teams.filter(t => {
        return t.slug === this.props.teamSlug;
      });
      if (matches.length) {
        team = matches[0];
      }
    }
    return team;
  },

  handleClick: function() {
    this.setState({
      popoverShown: '',
    });
  },

  render: function() {
    const channel = this.getChannel();
    const team = this.getTeam();

    let pageContext = channel ? 'channel-container' : 'page-container';

    if (!channel && !team) {
      pageContext = 'why-do-i-program';
    }

    if (this.props.teamSlug && !team) return <div />;

    if (Meteor.user()) {
      return (
        <div onClick={this.handleClick}>
          <Sidebar
            channel={channel}
            popoverHide={this.popoverHide}
            popoverShown={this.state.popoverShown}
            popoverToggle={this.popoverToggle}
            team={team}
            teams={this.data.teams}
            user={this.data.user}
          />
          <section className={pageContext}>
            <Messages />
            <this.props.page
              channel={channel}
              channelIsFirstInList={this.channelIsFirstInList}
              channelIsLastInList={this.channelIsLastInList}
              itemId={this.props.itemId}
              popoverShown={this.state.popoverShown}
              popoverToggle={this.popoverToggle}
              team={team}
              teamItemChannelId={this.props.teamItemChannelId}
              teams={this.data.teams}
              user={this.data.user}
              userId={this.props.userId}
            />
          </section>
        </div>
      );
    } else {
      return (
        <div>
          <Messages />
          <this.props.page
            channel={channel}
            itemId={this.props.itemId}
            resetPasswordToken={this.props.resetPasswordToken}
            team={team}
          />
        </div>
      );
    }
  },
});
