'use strict';

const feed = require('./feed');

module.exports.handler = (event, context, callback) =>
  feed()
    .then(data => callback(null, data))
    .catch(callback);
