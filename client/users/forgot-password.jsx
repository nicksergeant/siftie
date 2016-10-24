import React from 'react';
import { Meteor } from 'meteor/meteor';

ForgotPassword = React.createClass({

  displayName: 'ForgotPassword',

  handleSubmit: function(e) {
    e.preventDefault();
    const email = elem('email', this).value;
    Meteor.call('requestNewPassword', email);
    Session.set('messages', [{
      type: 'success',
      message: 'An email has been sent to you with instructions on how to reset your password.'
    }]);
  },

  render: function() {
    return (
      <div className="fill -signup">
      <div className="marketing-page signup group">
        <div className="signup__sidebar">
          <a className="logo" href="/"></a>
          <h1>Reset password</h1>
        </div>
        <div className="signup__forms">
          <form onSubmit={this.handleSubmit}>
            <label className="field">
              <strong className="field__label">Email</strong>
              <input className="text" placeholder="you@yourdomain.com" ref="email" required type="text" />
            </label>
            <footer>
              <button className="-right" type="submit">
                Reset password <i className="icon -right ion-chevron-right"></i>
              </button>
            </footer>

          </form>
        </div>
      </div>
    </div>
    );
  }
});
