'use strict';

var table = [
        process.env.SERVERLESS_DATA_MODEL_STAGE ,
        'blog'
    ].join('-'),
    AWS = require('aws-sdk'),
    config = {
        region: AWS.config.region || 'us-east-1' // replace with yours region for local testing, e.g 'eu-west-1'
    },
    dynamodb = new AWS.DynamoDB.DocumentClient(config);

console.log('Table name:' + table);

module.exports = {
    
    // Get all posts
    // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
    getPosts: function(cb) {
        var params = {
            TableName: table,
            AttributesToGet: [
                'id',
                'title',
                'content',
                'date'
            ]
        };

        dynamodb.scan(params, function (error, response) {
            return cb(error, response);
        });
    },

    // Add new or edit post
    // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    addPost: function (item, cb) {
         var params = {
            TableName: table,
            Item: item
         }

         dynamodb.put(params, function (error, response) {
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
    deletePost: function (id, cb) {
         var params = {
            TableName: table,
            Key: id
         }

         dynamodb.delete(params, function (error, response) {
             if (!error) {
                response = {
                    message: "Successfully deleted!"
                };
             }
             return cb(error, response);
         });
    }
}
