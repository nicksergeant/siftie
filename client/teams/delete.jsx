import React from 'react';
import { Meteor } from 'meteor/meteor';

TeamDelete = React.createClass({

  displayName: 'TeamDelete',

  propTypes: {
    team: React.PropTypes.object
  },

  onClick: function(e) {
    if (confirm('Are you sure you want to delete this team?')) {
      const teamName = this.props.team.name;
      window.analytics.track('Team Deleted', {
        team: teamName
      });
      e.preventDefault();
      FlowRouter.go('/');
      Meteor.call('deleteTeam', this.props.team._id);
      Session.set('messages', [{
        type: 'success',
        message: 'Successfully deleted the "' + teamName + '" team.'
      }]);
    }
  },

  render: function() {
    return (
      <div>
        <button className="warning delete-team u-pull-right"
           onClick={this.onClick}>
          Delete team
        </button>
      </div>
    );
  }

});
