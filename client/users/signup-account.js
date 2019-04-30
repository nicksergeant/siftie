import PropTypes from 'prop-types';
import React from 'react';

SignupAccount = createReactClass({
  displayName: 'SignupAccount',

  propTypes: {
    switchToTab: PropTypes.func,
  },

  handleSubmit: function(e) {
    e.preventDefault();
    const email = elem('email', this).value;
    const password = elem('password', this).value;
    const passwordConfirmation = elem('password-confirmation', this).value;

    if (password !== passwordConfirmation) {
      return Session.set('messages', [
        { type: 'error', message: 'Passwords do not match.' },
      ]);
    }

    Accounts.createUser({ email: email, password: password }, err => {
      if (err) {
        Session.set('messages', [{ type: 'error', message: err.reason }]);
      } else {
        analytics.track('User Signed Up', {
          email: email,
        });
        const $teamJoin = Session.get('$teamJoin');
        const $teamInvitation = Session.get('$teamInvitation');
        if ($teamInvitation || $teamJoin) {
          this.props.switchToTab('done', { teamSlug: '' });
        } else {
          this.props.switchToTab('team');
        }
      }
    });
  },

  render: function() {
    return (
      <div className="fill -signup">
        <div className="marketing-page signup group">
          <div className="signup__sidebar">
            <a className="logo" href="/" />
            <h1>Sign up</h1>
            <p>
              In order to try out the beta, you're going to need a Siftie
              account.
            </p>
          </div>
          <div className="signup__forms">
            <ol className="progress-indicators">
              <li className="-active">•</li>
              <li>•</li>
            </ol>
            <form onSubmit={this.handleSubmit}>
              <label className="field">
                <strong className="field__label">Email</strong>
                <input
                  className="text"
                  placeholder="you@yourdomain.com"
                  ref="email"
                  required
                  type="text"
                />
              </label>
              <label className="field">
                <strong className="field__label">Password</strong>
                <input
                  className="text"
                  placeholder="••••••••••••"
                  ref="password"
                  required
                  type="password"
                />
              </label>
              <label className="field">
                <strong className="field__label">Confirm Password</strong>
                <input
                  className="text"
                  placeholder="••••••••••••"
                  ref="password-confirmation"
                  required
                  type="password"
                />
              </label>

              <footer>
                <a className="cancel -left" href="/">
                  Cancel
                </a>
                <button className="-right" type="submit">
                  Create Account
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    );
  },
});
