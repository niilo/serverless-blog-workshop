'use strict';

var dynamodb = require('../lib/dynamodb');

// Lambda Handler
module.exports.handler = function(event, context) {
    dynamodb.deletePost(event, function(error, response) {
        return context.done(error, response);
    });
};