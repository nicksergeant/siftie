import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

ItemUserRating = createReactClass({

  displayName: 'ItemUserRating',

  propTypes: {
    channel: PropTypes.object,
    item: PropTypes.object,
    team: PropTypes.object,
    teamItem: PropTypes.object
  },

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      userRating: null
    };
  },

  getMeteorData: function() {
    let userRating;
    if (this.props.teamItem && this.props.teamItem.ratings.length) {
      userRating = _.result(
        _.find(this.props.teamItem.ratings, {
          user: Meteor.userId()
        }),
      'rating');
    }
    return {
      userRating: userRating
    };
  },

  rate: function(rating) {
    Meteor.call('createRating',
      this.props.item._id,
      this.props.team._id,
      this.props.channel.id,
      rating,
      (error) => {
      if (error) {
        Session.set('messages', [{ type: 'error', message: error.reason }]);
      }
    });
    this.setState({
      userRating: rating
    });
  },

  star: function(rating) {
    if (!this.data.userRating) return <span className="star">★</span>;
    return this.data.userRating >= rating ?
      <span className="star -active">★</span> :
      <span className="star">★</span>;
  },

  render: function() {
    return (
      <div className="ratings ratings--user">
        <span className="label">Your Rating:</span>
        <div className="ratings__stars">
          <a onClick={this.rate.bind(this, 5)}>{this.star(5)}</a>
          <a onClick={this.rate.bind(this, 4)}>{this.star(4)}</a>
          <a onClick={this.rate.bind(this, 3)}>{this.star(3)}</a>
          <a onClick={this.rate.bind(this, 2)}>{this.star(2)}</a>
          <a onClick={this.rate.bind(this, 1)}>{this.star(1)}</a>
        </div>
      </div>
    );
  }

});
