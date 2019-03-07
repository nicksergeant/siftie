import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

let analyticsDebouncing = false;

Modal = createReactClass({

  displayName: 'Modal',

  propTypes: {
    channel: PropTypes.object,
    component: PropTypes.func,
    modalStatus: PropTypes.bool,
    modalTitle: PropTypes.string,
    onClose: PropTypes.func,
    team: PropTypes.object
  },

  componentWillReceiveProps: function(props) {
    if (props.modalStatus && !analyticsDebouncing) {
      analyticsDebouncing = true;
      window.analytics.track('Modal Shown', {
        name: this.props.modalTitle,
        channel: this.props.channel ? this.props.channel.name : null,
        team: this.props.team ? this.props.team.name : null
      });
      Meteor.setTimeout(() => {
        analyticsDebouncing = false;
      }, 500);
    }
  },

  render: function() {
    if (!this.props.component) return null;

    let modalStatus = this.props.modalStatus ? '-open' : '';

    return (
      <div className={'modal ' + modalStatus}>
        <div className="modal__bg" onClick={this.props.onClose}></div>
        <div className="modal__container">
          <header className="modal__header">
            <h1>{this.props.modalTitle}</h1>
            <a className="close icon ion-close-round" onClick={this.props.onClose}></a>
          </header>
          <div className="modal__body">
            <this.props.component
              channel={this.props.channel}
              closeModal={this.props.onClose}
              team={this.props.team}
            />
          </div>
        </div>
      </div>
    );
  }

});
