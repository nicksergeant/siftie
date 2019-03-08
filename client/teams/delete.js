import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

TeamDelete = createReactClass({
  displayName: 'TeamDelete',

  propTypes: {
    team: PropTypes.object,
  },

  onClick: function(e) {
    if (confirm('Are you sure you want to delete this team?')) {
      const teamName = this.props.team.name;
      analytics.track('Team Deleted', {
        team: teamName,
      });
      e.preventDefault();
      FlowRouter.go('/');
      Meteor.call('deleteTeam', this.props.team._id);
      Session.set('messages', [
        {
          type: 'success',
          message: 'Successfully deleted the "' + teamName + '" team.',
        },
      ]);
    }
  },

  render: function() {
    return (
      <div>
        <button
          className="warning delete-team u-pull-right"
          onClick={this.onClick}
        >
          Delete team
        </button>
      </div>
    );
  },
});
