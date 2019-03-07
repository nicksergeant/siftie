import React from 'react';
import { Meteor } from 'meteor/meteor';

Signup = createReactClass({

  displayName: 'Signup',

  getInitialState: function() {
    return {
      args: {},
      tab: Meteor.userId() ? 'team' : null
    }
  },

  switchToTab: function(tab, args) {
    this.setState({
      args: args,
      tab: tab
    });
  },

  render: function() {
    let component;

    switch (this.state.tab) {
      case 'team':
        component = <SignupTeam switchToTab={this.switchToTab} />;
      break;
      case 'invite':
        component = <SignupInvite switchToTab={this.switchToTab} />;
      break;
      case 'done':
        component = <div></div>;
        Meteor.setTimeout(() => {
          FlowRouter.go('/' + this.state.args ? this.state.args.teamSlug : '');
        });
      break;
      default:
        component = <SignupAccount switchToTab={this.switchToTab} />;
      break;
    }

    return component;
  }
});
