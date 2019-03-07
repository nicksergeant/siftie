import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

const YEAR = new Date().getFullYear();

Home = createReactClass({
  displayName: 'Home',

  propTypes: {
    teams: PropTypes.array,
  },

  render: function() {
    let home;
    if (Meteor.user()) {
      home = <div>Loading...</div>;

      if (this.props.teams.length) {
        Meteor.setTimeout(
          function() {
            var team = this.props.teams[0];
            if (
              team.channels &&
              team.channels.length &&
              team.channels.length > 2
            ) {
              return FlowRouter.go('/' + this.props.teams[0].slug + '/active');
            } else {
              return FlowRouter.go('/' + this.props.teams[0].slug);
            }
          }.bind(this)
        );
      }
    } else {
      home = (
        <div className="fill -home">
          <div className="marketing-page">
            <div className="billboard">
              <div className="row">
                <div className="small-2 large-8 columns">
                  <div className="beta-tag">
                    <a className="logo" href="/">
                      Siftie Reader
                    </a>
                  </div>
                </div>
                <nav className="small-2 large-4 columns">
                  <a href="/signup">Sign up</a>
                  <a href="/login">Log in</a>
                </nav>
              </div>
              <div className="row">
                <div className="small-4 large-12 columns">
                  <h1>
                    An RSS reader for <em>everyone</em>
                  </h1>
                  <p>
                    Siftie Reader is a simple RSS reader with built-in rating
                    and commenting features for friends, family, and team
                    members (or just yourself!).
                  </p>
                  <a className="button -green" href="/signup">
                    Create an account (Free)
                  </a>
                </div>
              </div>
            </div>
            <footer className="main-footer layer">
              <div className="row">
                <div className="main-footer__demo centered columns">
                  <div className="demo">
                    <img className="screen" src="/img/demo.gif" alt="" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="main-footer__logo large-12 columns">
                  <p className="emojis">📖👯💯</p>
                  <p>&copy; {YEAR} Siftie</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      );
    }

    return home;
  },
});
