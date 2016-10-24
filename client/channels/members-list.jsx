import React from 'react';
import { Meteor } from 'meteor/meteor';

ChannelMembersList = React.createClass({

  displayName: 'ChannelMembersList',

  propTypes: {
    channel: React.PropTypes.object,
    team: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      members: this.props.team.members
    };
  },

  search: function() {
    const query = elem('query', this).value;
    const members = this.props.team.members.filter(function(member) {
      return userEmail(member._id).indexOf(query) !== -1;
    });

    this.setState({
      members: members
    });
  },

  render: function() {
    const members = this.state.members.map((member) => {
      return (
        <li className="feeds__item channel-member-in-list group" key={member._id}>
          <span>
            {userEmail(member._id)}
          </span>
        </li>
      );
    });

    return (
      <div>
        <input
          onChange={this.search}
          placeholder="Quick search..."
          ref="query"
          style={{width: '100%'}}
          type="text"
        />
        <ul className="feeds" style={{ marginTop: '1.5rem' }}>
          {members}
        </ul>
      </div>
    );
  }
});
