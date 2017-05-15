import React from 'react';

TeamList = React.createClass({

  displayName: 'TeamList',

  propTypes: {
    onClick: React.PropTypes.func,
    teams: React.PropTypes.array
  },

  sorted: function() {
    return _(this.props.teams).sortBy('name').value();
  },

  render: function() {
    const teams = this.sorted().map((team) => {
      let className = '';
      if (this.props.activeTeam && this.props.activeTeam === team.name) {
        className = 'active';
      }

      return (
        <a
          className={className}
          href={'/' + team.slug + '/active/'}
          key={team._id}
          onClick={this.props.onClick}>
          {team.name}
        </a>
      );
    });
    return (
      <div>
        {teams}
      </div>
    );
  }

});
