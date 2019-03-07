import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

let analyticsDebouncing = false;

PhotoModal = createReactClass({
  displayName: 'PhotoModal',

  propTypes: {
    channel: PropTypes.object,
    modalStatus: PropTypes.bool,
    modalTitle: PropTypes.string,
    onClose: PropTypes.func,
    photo: PropTypes.string,
    team: PropTypes.object,
  },

  componentWillReceiveProps: function(props) {
    if (props.modalStatus && !analyticsDebouncing) {
      analyticsDebouncing = true;
      window.analytics.track('Modal Shown', {
        name: this.props.modalTitle,
        channel: this.props.channel.name,
        team: this.props.team.name,
      });
      Meteor.setTimeout(() => {
        analyticsDebouncing = false;
      }, 500);
    }
  },

  render: function() {
    let modalStatus = this.props.modalStatus ? '-open' : '';

    return (
      <div className={'modal -photo ' + modalStatus}>
        <div className="modal__bg" onClick={this.props.onClose} />
        <div className="modal__container">
          <header className="modal__header">
            <h1>{this.props.modalTitle}</h1>
            <a
              className="close icon ion-close-round"
              onClick={this.props.onClose}
            />
          </header>
          <div className="modal__body">
            <a href={this.props.photo} target="_blank">
              <img src={this.props.photo} />
            </a>
          </div>
        </div>
      </div>
    );
  },
});
