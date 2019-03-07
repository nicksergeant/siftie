const emojify = require('emojify.js');
const linkify = require('linkifyjs');
const linkifyHtml = require('linkifyjs/html');

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

CommentDetail = createReactClass({

  displayName: 'CommentDetail',

  propTypes: {
    comment: PropTypes.object,
    team: PropTypes.object,
    teamItem: PropTypes.object
  },

  mixins: [ReactMeteorData],

  getInitialState: function() {
    emojify.setConfig({
      img_dir: '/img/emoji'
    });

    return {
      editing: false
    }
  },

  componentDidMount: function() {
    this.emojify();
  },

  componentDidUpdate: function() {
    this.emojify();
  },

  getMeteorData: function() {
    return {
      user: Meteor.users.findOne(this.props.comment.user)
    };
  },

  emojify: function() {
    Meteor.setTimeout(() => {
      emojify.run(this.refs.spanText);
    });
  },

  gravatar: function() {
    const hash = new CryptoJS.MD5(userEmail(this.data.user._id)).toString();
    return `https://secure.gravatar.com/avatar/${hash}?s=50`;
  },

  createdAtTimeago: function() {
    return moment(this.props.comment.createdAt).fromNow();
  },

  createdAtString: function() {
    return this.props.comment.createdAt.toISOString();
  },

  imgify: function(comment) {
    let matches = comment.match(/https?:\/\/.*?\.(?:png|jpg|jpeg|gif)(\s|$|\"|\')/ig);
    _.uniq(matches).forEach(function(match) {
      comment += `<img src="${match}" />`;
    });
    return comment;
  },

  linebreakify: function(comment) {
    return comment.replace(/(?:\r\n|\r|\n)/g, '<br />');
  },

  toggleEditing: function(e) {
    if (e) e.preventDefault();
    this.setState({ 
      editing: !this.state.editing
    });
  },

  render: function() {
    const linkified = linkifyHtml(this.props.comment.comment, {
      defaultProtocol: 'http'
    });
    const linkifiedComment = {
      __html: this.linebreakify(this.imgify(linkified))
    };

    let editToggle;
    if (this.props.comment.user === Meteor.userId()) {
      editToggle = (
        <a className={'edit-toggle icon ion-edit'}
          onClick={this.toggleEditing}>
        </a>
      );
    }

    let body;
    if (this.state.editing) {
      body = (
        <CommentEdit
          comment={this.props.comment}
          onDone={this.toggleEditing}
          teamItem={this.props.teamItem}
        />
      );
    } else {
      body = <span ref="spanText" className="text" dangerouslySetInnerHTML={linkifiedComment} />
    }

    return (
      <li className="comments__item group">
        <div className="avatar">
          <img src={this.gravatar()} />
        </div>
        <div className="body">
          <a href={'/' + this.props.team.slug + '/members/' + this.data.user._id}>
            <strong className="user">{userName(this.data.user._id)}</strong>
          </a>
          <small className="timestamp" data-livestamp={this.createdAtString()}>
            {this.createdAtTimeago()}
          </small><br />
          {body}
          {editToggle}
        </div>
      </li>
    );
  }

});
