import React from 'react';

TeamDetail = React.createClass({

  displayName: 'TeamDetail',

  propTypes: {
    team: React.PropTypes.object
  },

  render: function() {
    if (this.props.team && this.props.team.channels && this.props.team.channels.length) {
      return (
        <div>
          <div className="tour-point tour-create-channel">Create a channel by clicking the "+" here.</div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Howdy! Welcome to your new team</h1>
          <div className="tour-point tour-create-channel">
            To get started, create a new channel by clicking the "+" here.
          </div>
        </div>
      );
    }
  }
});
