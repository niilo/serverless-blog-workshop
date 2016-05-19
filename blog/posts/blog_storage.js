'use strict';

let table = [
    process.env.SERVERLESS_STAGE,
    'blog'
  ].join('-'),
  AWS = require('aws-sdk'),
  config = {
    region: AWS.config.region || process.env.SERVERLESS_REGION || 'us-east-1' // replace with yours region for local testing, e.g 'eu-west-1'
  },
  dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports = {

  // Get all posts
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  getPosts: (cb) => {
    let params = {
      TableName: table,
      AttributesToGet: [
        'id',
        'title',
        'content',
        'date'
      ]
    };

    dynamodb.scan(params, (error, response) => {
      return cb(error, response);
    });
  },

  // Add new or edit post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  savePost: (item, cb) => {
    let params = {
      TableName: table,
      Item: item
    };

    dynamodb.put(params, (error, response) => {
      if (!error) {
        response = {
          message: "Success!"
        };
      }
      return cb(error, response);
    });
  },

  // Delete post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
  deletePost: (id, cb) => {
    let params = {
      TableName: table,
      Key: {id: id}
    };

    dynamodb.delete(params, (error, response) => {
      if (!error) {
        response = {
          message: "Successfully deleted!"
        };
      }
      return cb(error, response);
    });
  }
};
