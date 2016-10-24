'use strict';

let os = require('os');
let hostname = os.hostname();
let MongoClient = require('mongodb').MongoClient;
let Promise = require('bluebird');

module.exports = {
  connection: null,
  connect: function() {
    return new Promise(function(resolve) {
      let mongoUri;
      if (hostname === 'siftie.com') {
        mongoUri = 'mongodb://localhost:27017/siftie';
      } else {
        mongoUri = 'mongodb://localhost:3001/meteor';
      }
      MongoClient.connect(mongoUri, function(error, db) {
        if (error) throw new Error(error);
        this.connection = db;
        resolve();
      }.bind(this));
    }.bind(this));
  }
};
