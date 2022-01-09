import PropTypes from 'prop-types';
import React from 'react';

TeamList = createReactClass({
  displayName: 'TeamList',

  propTypes: {
    onClick: PropTypes.func,
    teams: PropTypes.array,
  },

  getInitialState: function() {
    const sortedTeams = this.sorted();

    window.switchToTeam = number => {
      const team = sortedTeams[number - 1];
      if (team) FlowRouter.go(`/${team.slug}/active/`);
    };

    return { sortedTeams };
  },

  sorted: function() {
    return _(this.props.teams)
      .sortBy('name')
      .value();
  },

  render: function() {
    const teams = this.state.sortedTeams.map(team => {
      let className = '';
      if (this.props.activeTeam && this.props.activeTeam === team.name) {
        className = 'active';
      }

      return (
        <a
          className={className}
          href={'/' + team.slug + '/active/'}
          key={team._id}
          onClick={this.props.onClick}
        >
          {team.name}
        </a>
      );
    });
    return <div>{teams}</div>;
  },
});
