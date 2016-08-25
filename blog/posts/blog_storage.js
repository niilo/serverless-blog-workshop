const AWS = require('aws-sdk');

const tablePostfix = '-blog-aws-serverless-hackathon';
const config = {
  region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1',
};
const dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports = {

  // Get all posts
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  getPosts: (event, cb) => {
    const params = {
      TableName: event.stage + tablePostfix,
      AttributesToGet: [
        'id',
        'title',
        'content',
        'date',
      ],
    };

    dynamodb.scan(params, (error, response) => cb(error, response));
  },

  // Add new or edit post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  savePost: (event, cb) => {
    const post = event.body;
    // If PUT request, set Id from path to object
    if (event.path && event.path.id) {
      post.id = event.path.id;
    } else {
      post.id = Date.now().toString();
    }

    const params = {
      TableName: event.stage + tablePostfix,
      Item: post,
    };

    dynamodb.put(params, (error, response) => {
      if (!error) {
        cb(null, { post });
      }
      return cb(error, response);
    });
  },

  // Delete post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
  deletePost: (event, cb) => {
    const params = {
      TableName: event.stage + tablePostfix,
      Key: { id: event.path.id },
    };

    dynamodb.delete(params, (error, response) => {
      if (!error) {
        cb(null, { post: event.id });
      }
      return cb(error, response);
    });
  },
};
