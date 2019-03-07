import React from 'react';

InvitationDetail = createReactClass({
  displayName: 'InvitationDetail',

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      team: null,
    };
  },

  getMeteorData: function() {
    return {
      team: Session.get('$teamInvitation'),
    };
  },

  render: function() {
    return (
      <div>
        <h5 style={{ textAlign: 'center' }}>
          You're invited to join {this.data.team.name}
        </h5>
        <p style={{ textAlign: 'center' }}>
          Sign up or log in to join:
          <br />
          <a className="button" href="/login" style={{ marginTop: '10px' }}>
            Login
          </a>
          <a className="button" href="/signup">
            Signup
          </a>
        </p>
      </div>
    );
  },
});
