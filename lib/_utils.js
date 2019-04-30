const uuid = require('node-uuid');

import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

analytics = {
  identify: () => {},
  load: () => {},
  page: () => {},
  track: () => {},
};

_ = lodash;

elem = function(key, ctx) {
  return ReactDOM.findDOMNode(ctx.refs[key]);
};

userEmail = function(userId, forDelivery) {
  if (!userId) return;
  if (forDelivery && Meteor.absoluteUrl() !== 'https://siftie.com/') {
    const user = Meteor.users.findOne(forDelivery);
    if (user) return user.emails[0].address;
  } else {
    const user = Meteor.users.findOne(userId);
    if (user) return user.emails[0].address;
  }
};

userName = function(userId) {
  if (!userId) return;
  const user = Meteor.users.findOne(userId);
  if (user && user.profile && user.profile.name && user.profile.name !== '') {
    return user.profile.name;
  } else {
    return userEmail(userId);
  }
};

userAvatar = function(userId) {
  const hash = new CryptoJS.MD5(userEmail(userId)).toString();
  return `https://secure.gravatar.com/avatar/${hash}?s=50`;
};

imagePreloader = function() {
  return <div />;
};

// Meteor's ecmascript package doesn't yet support String.repeat.
// This is a polyfill from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError("can't convert " + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError(
        'repeat count must not overflow maximum string size'
      );
    }
    var rpt = '';
    for (;;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    return rpt;
  };
}

createReactClass = require('create-react-class');
