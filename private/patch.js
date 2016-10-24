'use strict';

let db = require('./lib/db');
let Promise = require('bluebird');

let teamsPromise = new Promise(function(resolve, reject) {
  db.connect().then(function() {
    db.connection.collection('teams').find({})
      .toArray(function(error, teams) {
        if (error) return reject(error);
        resolve(teams);
      });
  });
});

teamsPromise.then(function(teams) {

  let promises = [];

  teams.forEach(function(team) {

    const newMembers = team.members.map(function(member) {
      return {
        _id: member
      };
    });

    promises.push(new Promise(function(resolve) {
      db.connection.collection('teams').update({ _id: team._id }, {
        $set: { members: newMembers }
      }, function(err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    }));
  });

  return Promise.all(promises);

}).then(function() {
  process.exit();
});
