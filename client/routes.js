import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

function autoAcceptInvitation() {
  const $teamInvitation = Session.get('$teamInvitation');
  if (Meteor.userId() && $teamInvitation) {
    Meteor.call('acceptInvitation', $teamInvitation.invitationId, function() {
      FlowRouter.go('/' + $teamInvitation.slug);
      delete Session.keys.$teamInvitation;
    });
  }
}
function autoAcceptJoin() {
  const $teamJoin = Session.get('$teamJoin');
  if (Meteor.userId() && $teamJoin) {
    Meteor.call('acceptTeamJoin', $teamJoin, function() {
      FlowRouter.go('/' + $teamJoin.slug);
      delete Session.keys.$teamJoin;
    });
  }
}
function clearSessionVariables() {
  Object.keys(Session.keys).forEach(function(key) {
    if (key[0] !== '$') {
      Session.set(key, undefined);
      delete Session.keys[key];
    }
  });
}
function redirectToLogin() {
  Meteor.setTimeout(function() {
    FlowRouter.go('/login');
  });
}

FlowRouter.route('/', {
  action: function() {
    window.analytics.page('Home');
    const hostname = document.location.hostname;
    ReactDOM.render(<App page={Home} />, document.getElementById('app'));
  },
});
FlowRouter.route('/login', {
  action: function() {
    window.analytics.page('Login');
    ReactDOM.render(<App page={Login} />, document.getElementById('app'));
  },
});
FlowRouter.route('/forgot-password', {
  action: function() {
    window.analytics.page('Forgot Password');
    ReactDOM.render(
      <App page={ForgotPassword} />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/forgot-password/:resetPasswordToken', {
  action: function(params) {
    window.analytics.page('Reset Password');
    ReactDOM.render(
      <App
        page={ResetPassword}
        resetPasswordToken={params.resetPasswordToken}
      />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/logout', {
  action: function() {
    const user = Meteor.user();
    window.analytics.track('User Logged Out', {
      email: userEmail(user),
    });
    Meteor.logout();
    Meteor.setTimeout(function() {
      FlowRouter.go('/login');
    }, 500);
  },
});
FlowRouter.route('/signup', {
  action: function() {
    window.analytics.page('Signup');
    ReactDOM.render(<App page={Signup} />, document.getElementById('app'));
  },
});
FlowRouter.route('/account', {
  action: function() {
    window.analytics.page('UserSettings');
    ReactDOM.render(
      <App page={UserSettings} />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/join/:id', {
  action: function(params) {
    Meteor.call('getTeamJoinKey', params.id, function(error, result) {
      if (!result) return FlowRouter.go('/login');
      Session.set('$teamJoin', result);
      window.analytics.page('Join Team');
      if (Meteor.userId()) {
        FlowRouter.go('/' + result.slug);
      } else {
        return ReactDOM.render(
          <App page={TeamJoin} />,
          document.getElementById('app')
        );
      }
    });
  },
});
FlowRouter.route('/invite/:id', {
  action: function(params) {
    Meteor.call('getInvitation', params.id, function(error, result) {
      if (!result) return FlowRouter.go('/login');
      window.analytics.page('Invitation Detail');
      Session.set('$teamInvitation', result);
      if (Meteor.userId()) {
        FlowRouter.go('/' + result.slug);
      } else {
        return ReactDOM.render(
          <App page={InvitationDetail} />,
          document.getElementById('app')
        );
      }
    });
  },
});
FlowRouter.route('/:teamSlug/members', {
  action: function(params) {
    if (!Meteor.userId()) return redirectToLogin();
    window.analytics.page('Team Members');
    ReactDOM.render(
      <App page={MemberList} teamSlug={params.teamSlug} />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/:teamSlug/members/:userId', {
  action: function(params) {
    if (!Meteor.userId()) return redirectToLogin();
    window.analytics.page('Team Members');
    ReactDOM.render(
      <App
        page={MemberDetail}
        teamSlug={params.teamSlug}
        userId={params.userId}
      />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/:teamSlug/settings', {
  action: function(params) {
    if (!Meteor.userId()) return redirectToLogin();
    window.analytics.page('Team Settings');
    ReactDOM.render(
      <App page={TeamSettings} teamSlug={params.teamSlug} />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/:teamSlug/:channelSlug', {
  action: function(params) {
    if (!Meteor.userId()) return redirectToLogin();
    window.analytics.page('Channel Detail');
    ReactDOM.render(
      <App
        channelSlug={params.channelSlug}
        page={ChannelDetail}
        teamSlug={params.teamSlug}
      />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/:teamSlug/:channelSlug/:itemId', {
  subscriptions: function(params) {
    this.register('item', Meteor.subscribe('item', params));
  },
  action: function(params) {
    if (!Meteor.userId()) return redirectToLogin();
    window.analytics.page('Item Detail');
    ReactDOM.render(
      <App
        channelSlug={params.channelSlug}
        itemId={params.itemId}
        page={ItemDetail}
        teamSlug={params.teamSlug}
      />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/:teamSlug/:channelSlug/:channelId/:itemId', {
  subscriptions: function(params) {
    this.register('item', Meteor.subscribe('item', params));
  },
  action: function(params) {
    if (!Meteor.userId()) return redirectToLogin();
    window.analytics.page('Active Item Detail');
    ReactDOM.render(
      <App
        channelSlug={params.channelSlug}
        itemId={params.itemId}
        page={ItemDetail}
        teamItemChannelId={params.channelId}
        teamSlug={params.teamSlug}
      />,
      document.getElementById('app')
    );
  },
});
FlowRouter.route('/:teamSlug', {
  action: function(params) {
    if (!Meteor.userId()) return redirectToLogin();
    window.analytics.page('Team Detail');
    ReactDOM.render(
      <App page={TeamDetail} teamSlug={params.teamSlug} />,
      document.getElementById('app')
    );
  },
});
FlowRouter.notFound = {
  action: function() {
    ReactDOM.render(
      <App page={PageNotFound} />,
      document.getElementById('app')
    );
  },
};

FlowRouter.triggers.enter([
  autoAcceptInvitation,
  autoAcceptJoin,
  clearSessionVariables,
]);
