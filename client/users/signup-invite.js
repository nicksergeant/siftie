import PropTypes from 'prop-types';
import React from 'react';

SignupInvite = createReactClass({

  displayName: 'SignupInvite',

  propTypes: {
    switchToTab: PropTypes.func
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.props.switchToTab('done');
  },

  render: function() {
    return (
      <div className="signup">
        <div className="signup__sidebar">
          <a className="logo" href="/"></a>
          <h1>Team</h1>
          <p>Blah blah.</p>
          <p>team</p>
        </div>
        <div className="signup__forms">
          <ol className="progress-indicators">
            <li>•</li>
            <li className="-active">•</li>
            <li>•</li>
          </ol>
          <form onSubmit={this.handleSubmit}>
            this is some clever onboarding
            <footer>
              <button className="-right" type="submit">
                Next <i className="icon -right ion-chevron-right"></i>
              </button>
            </footer>
          </form>
        </div>
      </div>
    );
  }
});
