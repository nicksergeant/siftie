import PropTypes from 'prop-types';
import React from 'react';

ItemAverageRating = createReactClass({
  displayName: 'ItemAverageRating',

  propTypes: {
    detail: PropTypes.bool,
    team: PropTypes.object,
    teamItem: PropTypes.object,
  },

  stars: function() {
    let avg;
    let stars = [];

    if (this.props.teamItem && this.props.teamItem.ratings.length) {
      const ratings = _(this.props.teamItem.ratings).pluck('rating');
      const avgFloat = ratings.sum() / ratings.value().length;
      avg = Math.round(avgFloat * 1) / 1;
    }

    let i = 1;
    while (i <= 5) {
      stars.push(i <= avg ? '★' : '☆');
      i++;
    }

    return stars;
  },

  render: function() {
    let averageRating = <div />;

    if (this.props.teamItem && this.props.teamItem.ratings.length) {
      let stars = this.stars().map((star, i) => {
        return star === '★' ? (
          <span
            className="star -active"
            key={`${this.props.teamItem._id}-${i}-active`}
          >
            ★
          </span>
        ) : (
          <span
            className="star"
            key={`${this.props.teamItem._id}-${i}-inactive`}
          >
            ★
          </span>
        );
      });

      const label = this.props.detail ? (
        <h5 className="section-label">Average rating</h5>
      ) : null;

      const ratingsLabel = this.props.detail ? ' ratings' : '';
      const detailClass = this.props.detail ? ' -detail' : '';

      averageRating = (
        <div className={'ratings' + detailClass}>
          {label}
          <span className="stars">{stars}</span>
          <span className="ratings__count">
            {this.props.teamItem.ratings.length}
            {ratingsLabel}
          </span>
        </div>
      );
    }

    return averageRating;
  },
});
