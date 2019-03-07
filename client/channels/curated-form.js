import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

CuratedForm = createReactClass({

  displayName: 'CuratedForm',

  propTypes: {
    team: PropTypes.object
  },

  handleSubmit(e) {
    e.preventDefault();

    const url = this.refs.url.value;

    Meteor.call('createCuratedLink', url, this.props.team._id);

    this.refs.url.value = '';

    Session.set('messages', [{
      type: 'success',
      message: 'Link submitted. We will grab the content and it will appear here shortly!'
    }]);
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input className="curated-form-input"
          placeholder="Share a link"
          ref="url"
          type="url"
        />
      </form>
    );
  }

});
