'use strict';

const BlogStorage = require('./BlogStorage');
const AWS = require('aws-sdk');

const config = {
  region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1',
};
const dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports.createPost = function createPost(event, context, cb) {
  const blog = new BlogStorage(dynamodb, event.stage);
  blog.savePost(event.body, cb);
};

module.exports.getPosts = function getPosts(event, context, cb) {
  const blog = new BlogStorage(dynamodb, event.stage);
  blog.getPosts({}, cb);
};

module.exports.updatePost = function updatePost(event, context, cb) {
  const blog = new BlogStorage(dynamodb, event.stage);
  blog.updatePost(event.path.id, event.body, cb);
};

module.exports.removePost = function removePost(event, context, cb) {
  const blog = new BlogStorage(dynamodb, event.stage);
  blog.deletePost(event.path.id, cb);
};
