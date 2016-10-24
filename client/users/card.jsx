import React from 'react';

UserCard = React.createClass({

  displayName: 'UserCard',

  propTypes: {
    showUserSettingsModal: React.PropTypes.func,
    user: React.PropTypes.object
  },

  gravatar: function() {
    const hash = new CryptoJS.MD5(userEmail(this.props.user._id)).toString();
    return `https://secure.gravatar.com/avatar/${hash}?s=50`;
  },

  render: function() {
    return (
      <footer className="channel-panel__footer">
        <div className="avatar">
          <a onClick={this.props.showUserSettingsModal}>
            <img src={this.gravatar()} />
          </a>
        </div>
        <p className="username">
          <a className="account" onClick={this.props.showUserSettingsModal}>
            <strong>{userName(this.props.user._id)}</strong>
          </a>
          <a className="logout" href="/logout">Log out</a>
        </p>
      </footer>
    );
  }
});
