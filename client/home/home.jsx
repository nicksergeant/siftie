import React from 'react';
import { Meteor } from 'meteor/meteor';

Home = React.createClass({

  displayName: 'Home',

  propTypes: {
    teams: React.PropTypes.array
  },

  render: function() {
    let home;
    if (Meteor.user()) {
      home = <div>Loading...</div>;

      if (this.props.teams.length) {
        Meteor.setTimeout(function() {
          var team = this.props.teams[0];
          if (team.channels && team.channels.length) {
            return FlowRouter.go('/' + this.props.teams[0].slug + '/active');
          } else {
            return FlowRouter.go('/' + this.props.teams[0].slug);
          }
        }.bind(this));
      }
    } else {
      home = (
        <div className="fill -home">
          <div className="marketing-page">
             <div className="billboard">
               <div className="row">
                 <div className="small-2 large-8 columns">
                   <div className="beta-tag">
                     <a className="logo" href="/">Siftie</a>
                   </div>
                 </div>
                 <nav className="small-2 large-4 columns">
                   <a href="/signup">Sign up</a>
                   <a href="/login">Log in</a>
                 </nav>
               </div>

                <div className="row">
                  <div className="small-4 large-12 columns">
                    <h1><em>The</em> RSS reader for your team</h1>
                    <p>Siftie is a shared space to read and discuss the news that is important to your teams. Harness the wisdom of your people to surface information, prioritize learning, and maximize reading efficiency.
                    </p>
                    <a className="button -green" href="/signup">Create a Team (Beta)</a>
                  </div>
                </div>
             </div>

             <section className="layer">
               <div className="row">
                 <div className="large-12 columns">
                   <ul className="features">
                     <li className="features__item">
                       <i className="icon ion-ios-time"></i>
                       <h2>Maximize efficiency</h2>
                       <p>Have only a few minutes to read? Siftie helps you read only the most useful content within the context of your team and channels. You'll never have everyone waste their time reading the same clickbait again.</p>
                     </li>
                     <li className="features__item">
                       <i className="icon ion-chatboxes"></i>
                       <h2>Threaded conversations</h2>
                       <p>Team members can comment on links whenever they have time between tasks. Siftie minimizes chat distractions and encourages participation regardless of working style. </p>
                     </li>
                     <li className="features__item">
                       <i className="icon ion-ios-analytics"></i>
                       <h2><span className="tag">Coming Soon (PRO)</span>Feed recommendations</h2>
                       <p>Siftie will analyze which feeds provide the least value to your team and recommend alternatives. Your team evolves, and so should your feeds. Intelligent feed value scoring helps ensure you're always finding content that makes your team better.</p>
                     </li>
                     <li className="features__item">
                       <i className="icon ion-ios-download"></i>
                       <h2><span className="tag">Coming Soon</span>Import/Export</h2>
                       <p>Siftie makes it easy to get started by importing an OPML file from your old feed reader. You also can export your Siftie feeds. Your data is your data.</p>
                     </li>
                   </ul>
                 </div>
               </div>
             </section>

             <footer className="main-footer layer">
               <div className="row">
                 <div className="main-footer__demo small-4 medium-4 large-6 columns">
                   <div className="demo">
                     <img className="screen" src="/img/demo.gif" alt="" />
                   </div>
                 </div>
                 <div className="main-footer__content small-4 medium-8 large-6 columns">
                   <h2>See how Siftie can help your team</h2>
                   <p>Tell us the size of your team, and we'll arrange an onboarding session to help you get your data in and people started.</p>
                   <a href="mailto:support@siftie.com" className="button">Get in Touch</a>
                 </div>
               </div>
               <div className="row">
                 <div className="main-footer__logo large-12 columns">
                   <p className="emojis">📖👯💯</p>
                   <p>&copy; 2016 Siftie</p>
                 </div>
               </div>
             </footer>
          </div>
        </div>
      );
    }

    return home;
  }
});
