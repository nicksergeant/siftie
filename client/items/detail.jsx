import ImageLoader from 'react-imageloader';
import React from 'react';
import { Meteor } from 'meteor/meteor';

let focusedCount = 0;
let lastItemFocused;

ItemDetail = React.createClass({

  displayName: 'ItemDetail',

  propTypes: {
    channel: React.PropTypes.object,
    channelIsFirstInList: React.PropTypes.func,
    channelIsLastInList: React.PropTypes.func,
    itemId: React.PropTypes.string,
    popoverShown: React.PropTypes.string,
    popoverToggle: React.PropTypes.func,
    team: React.PropTypes.object,
    teamItemChannelId: React.PropTypes.string
  },

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      photoModalShown: false
    };
  },

  getMeteorData: function() {
    return {
      item: Items.findOne(new Meteor.Collection.ObjectID(this.props.itemId)),
      teamItem: TeamItems.findOne({
        itemId: new Meteor.Collection.ObjectID(this.props.itemId),
        teamId: this.props.team._id,
        channelId: this.props.teamItemChannelId || this.props.channel.id
      })
    };
  },

  channel: function() {
    return _.findWhere(this.props.team.channels, {
      id: this.props.teamItemChannelId || this.props.channel.id
    });
  },

  focusInList: function() {
    if (this.data.item) {
      if (focusedCount < 3 || this.data.item._id._str !== lastItemFocused) {
        $('article.post#id-' + this.data.item._id).scrollintoview({ duration: 0 });
        lastItemFocused = this.data.item._id._str;
        focusedCount = focusedCount + 1;
      }
    }
  },

  itemDescription: function() {
    let description = '';
    if (this.data.item.description) {
      description = this.data.item.description
        .replace(/href\=/g, 'target="_blank" href=');
    }
    return {
      __html: description
    };
  },

  onClick: function(e) {
    if (window.macgap &&
        e.target.tagName === 'A' &&
        e.target.href) {
      e.preventDefault();
      macgap.app.open(e.target.href);
    }
  },

  pubDateTimeago: function() {
    return moment(this.data.item.pubDate).fromNow();
  },

  pubDateString: function() {
    return this.data.item.pubDate.toISOString();
  },

  getCommentCount: function() {
    return this.data.teamItem ?
      this.data.teamItem.comments.length : 0;
  },

  togglePhotoModal: function() {
    window.analytics.track('Photo Modal Toggled', {
      channel: this.props.channel.name,
      item: this.props.itemId,
      team: this.props.team.name
    });
    this.setState({ photoModalShown: !this.state.photoModalShown });
  },

  toggleVisibility: function(e) {
    e.preventDefault();
    Meteor.call('toggleItemVisibility',
      this.data.item._id,
      this.props.team._id,
      this.props.teamItemChannelId || this.props.channel.id
    );
  },

  scrollTo: function(e) {
    e.preventDefault();
    const scrollTarget = $(e.currentTarget).attr('href');
    const elm = document.querySelector(scrollTarget);
    elm.scrollIntoView(true);
  },

  render: function() {
    const commentCount = this.getCommentCount();
    let commentLabel = (commentCount === 1) ?
      commentCount + ' comment' :
      commentCount + ' comments';

    let item;
    if (this.data.item) {
      this.focusInList();

      let imgClass = this.data.item.featuredImage ? '-featured' : '';
      let featuredImage;
      if (this.data.item.featuredImage) {
        featuredImage = (
          <ImageLoader
            preloader={imagePreloader}
            src={this.data.item.featuredImage}
            wrapper={React.DOM.div}>
            Image load failed!
          </ImageLoader>
        );
      }

      let expandImgIcon;
      if (this.data.item.featuredImage) {
        expandImgIcon = (
          <i className="expand-img icon ion-arrow-expand" onClick={this.togglePhotoModal}></i>
        );
      }

      let photoModal;
      if (this.data.item.featuredImage) {
        photoModal = (
          <PhotoModal
            channel={this.props.channel}
            modalStatus={this.state.photoModalShown}
            modalTitle="Original Photo"
            onClose={this.togglePhotoModal}
            photo={this.data.item.featuredImage}
            team={this.props.team}
          />
        )
      }

      item = (
        <div>
          {photoModal}
          <div className="post-detail-panel">
            <article className={'post post--detail ' + imgClass}>
              <div className="post__header">
                <div className="article-tools">
                  {expandImgIcon}
                </div>
                <div className="headline">
                  <a className="item-link" href={this.data.item.link} target="_blank">
                    <h1>{this.data.item.title}</h1>
                  </a>
                  <div className="timestamp">
                    <span className="post-source icon ion-android-bookmark">
                      {this.data.item.feedTitle}
                    </span>
                    <span className="post-date icon ion-ios-clock"
                      data-livestamp={this.pubDateString()}>
                      {this.pubDateTimeago()}
                    </span>
                    <span className="comments-link ion-ios-chatbubble">
                      <a href="#comments" onClick={this.scrollTo}> {commentLabel}</a>
                    </span>
                  </div>
                </div>
                {featuredImage}
              </div>
              <div className="post__body"
                dangerouslySetInnerHTML={this.itemDescription()}
                onClick={this.onClick}
              />
              <div className="post__footer">
                <a className="button" href={this.data.item.link} target="_blank">
                  Read on website
                  <i className="icon -right ion-android-open"></i>
                </a>
              </div>
            </article>
            <ItemRatings
              channel={this.channel()}
              item={this.data.item}
              team={this.props.team}
              teamItem={this.data.teamItem}
            />
            <ItemComments
              channel={this.channel()}
              item={this.data.item}
              team={this.props.team}
              teamItem={this.data.teamItem}
            />
          </div>
        </div>
      );
    }
    return (
      <ChannelDetail
        channel={this.props.channel}
        channelIsFirstInList={this.props.channelIsFirstInList}
        channelIsLastInList={this.props.channelIsLastInList}
        className="item-detail"
        focusInList={this.focusInList}
        isDetail
        popoverShown={this.props.popoverShown}
        popoverToggle={this.props.popoverToggle}
        team={this.props.team}>
        {item}
      </ChannelDetail>
    );
  }
});
