'use strict';

class BlogStorage {

  constructor(dynamodb, stage) {
    this.dynamodb = dynamodb;
    this.baseParams = {
      TableName: `${stage}-blog-aws-serverless-hackathon`,
    };
  }

  // Get all posts
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  getPosts(event, cb) {
    const params = Object.assign({}, this.baseParams, {
      AttributesToGet: [
        'id',
        'title',
        'content',
        'date',
      ],
    });

    this.dynamodb.scan(params, (error, response) => cb(error, response));
  }

  // Add new post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  savePost(event, cb) {
    const post = event.body;
    post.id = Date.now().toString();

    const params = Object.assign({}, this.baseParams, { Item: post });

    this.dynamodb.put(params, (error, response) => {
      if (!error) {
        return cb(null, { post });
      }
      return cb(error, response);
    });
  }

  // Edit post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  updatePost(event, cb) {
    const post = event.body;
    post.id = event.path.id;

    const params = Object.assign({}, this.baseParams, { Item: post });

    this.dynamodb.put(params, (error, response) => {
      if (!error) {
        return cb(null, { post });
      }
      return cb(error, response);
    });
  }

  // Delete post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
  deletePost(event, cb) {
    const params = Object.assign({}, this.baseParams,
      { Key: { id: event.path.id } }
    );

    this.dynamodb.delete(params, (error, response) => {
      if (!error) {
        return cb(null, { post: event.id });
      }
      return cb(error, response);
    });
  }
}

module.exports = BlogStorage;
