import React from 'react';
import { Meteor } from 'meteor/meteor';

let analyticsDebouncing = false;

PhotoModal = React.createClass({

  displayName: 'PhotoModal',

  propTypes: {
    channel: React.PropTypes.object,
    modalStatus: React.PropTypes.bool,
    modalTitle: React.PropTypes.string,
    onClose: React.PropTypes.func,
    photo: React.PropTypes.string,
    team: React.PropTypes.object
  },

  componentWillReceiveProps: function(props) {
    if (props.modalStatus && !analyticsDebouncing) {
      analyticsDebouncing = true;
      window.analytics.track('Modal Shown', {
        name: this.props.modalTitle,
        channel: this.props.channel.name,
        team: this.props.team.name
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
        <div className="modal__bg" onClick={this.props.onClose}></div>
        <div className="modal__container">
          <header className="modal__header">
            <h1>{this.props.modalTitle}</h1>
            <a className="close icon ion-close-round" onClick={this.props.onClose}></a>
          </header>
          <div className="modal__body">
            <a href={this.props.photo} target="_blank">
              <img src={this.props.photo} />
            </a>
          </div>
        </div>
      </div>
    );
  }

});
