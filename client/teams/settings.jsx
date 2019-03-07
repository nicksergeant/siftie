import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

TeamSettings = createReactClass({

  displayName: 'TeamSettings',

  propTypes: {
    team: PropTypes.object
  },

  updateTeam: function(e) {
    e.preventDefault();
    const name = elem('name', this).value;
    const slackWebhookUrl = elem('slack-webhook-url', this).value;
    if (!name) return true;
    Meteor.call('updateTeam', this.props.team._id, {
      name: name,
      slackWebhookUrl: slackWebhookUrl
    });
  },

  isOwner: function() {
    return this.props.team.owner === Meteor.userId();
  },

  render: function() {
    let deleteTeam;
    if (this.isOwner()) {
      deleteTeam = <TeamDelete team={this.props.team} />;
    }

    return (
      <div>
        <h1>Team Settings</h1>
          <form id="team-update" onSubmit={this.updateTeam}>
            <label>
              <strong>Team name:</strong>
              <input
                className="text"
                defaultValue={this.props.team.name}
                placeholder="Team name"
                ref="name"
                required
                type="text" />
            </label>
            <label>
              <strong>Slack Webhook:</strong>
              <input
                className="text"
                defaultValue={this.props.team.slackWebhookUrl}
                placeholder="Slack Webhook URL"
                ref="slack-webhook-url"
                type="text" />
            </label>
            <button type="submit">Save</button>
          </form>
          <div className="delete-box">
            <h4>Delete team</h4>
            {deleteTeam}
          </div>
      </div>
    );
  }

});
