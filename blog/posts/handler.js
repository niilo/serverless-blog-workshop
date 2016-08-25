'use strict';

const BlogStorage = require('./BlogStorage');
const AWS = require('aws-sdk');

const config = {
  region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1',
};
const dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports.handler = function handler(event, context, cb) {
  const blog = new BlogStorage(dynamodb, event.stage);

  switch (event.method) {
    case 'GET':
      blog.getPosts(event, cb);
      break;
    case 'POST':
      blog.savePost(event, cb);
      break;
    case 'PUT':
      blog.savePost(event, cb);
      break;
    case 'DELETE':
      blog.deletePost(event, cb);
      break;
    default:
      cb(`Invalid method ${event.method}`);
  }
};
