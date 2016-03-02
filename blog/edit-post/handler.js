'use strict';

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

var dynamodb = require('../lib/dynamodb');

// Lambda Handler
module.exports.handler = function(event, context) {
    dynamodb.addPost(event, function(error, response) {
        return context.done(error, response);
    });
};