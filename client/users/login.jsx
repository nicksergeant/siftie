import React from 'react';
import { Meteor } from 'meteor/meteor';

Login = createReactClass({

  displayName: 'Login',

  handleSubmit: function(e) {
    e.preventDefault();
    const email = elem('email', this).value;
    const password = elem('password', this).value;
    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        Session.set('messages', [{ type: 'error', message: err.reason }]);
      } else {
        window.analytics.track('User Logged In', {
          email: email
        });
        FlowRouter.go('/');
      }
    });
  },

  render: function() {
    return (
      <div className="fill -signup">
      <div className="marketing-page signup group">
        <div className="signup__sidebar">
          <a className="logo" href="/"></a>
          <h1>Log in</h1>
          <p>Forgot your password? <a href="/forgot-password">Reset it</a>.</p>
        </div>
        <div className="signup__forms">
          <form onSubmit={this.handleSubmit}>
            <label className="field">
              <strong className="field__label">Email</strong>
              <input className="text" placeholder="you@yourdomain.com" ref="email" required type="text" />
            </label>
            <label className="field">
              <strong className="field__label">Password</strong>
              <input className="text" placeholder="••••••••••••" ref="password" required type="password" />
            </label>
            <footer>
              <button className="-right" type="submit">
                Login <i className="icon -right ion-chevron-right"></i>
              </button>
            </footer>

          </form>
        </div>
      </div>
    </div>
    );
  }
});
