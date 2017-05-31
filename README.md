# Serverless Blog Workshop by SC5

Example backend project for AWS - Serverless hackathon.

Project is compatible with Serverless v1

## Step by step instructions for building the project with Serverless Framework v1.5

### Setup project

* Create the service from the `sc5-serverless-boilerplate`, change name my-serverless-blog to something unique:
```bash
> sls install -u https://github.com/SC5/sc5-serverless-boilerplate -n my-serverless-blog
> cd my-serverless-blog
> npm install
```

### Set up AWS profile and default region

Add defalt profile and region configuration to provider definition:

```
provider:
  ...
  profile: at-dev-aws
  region: eu-west-1
```

### Set up storage (DynamoDB)

* Un-comment `Resources:` and `resources:` in `serverless.yml`.

```
# DynamoDB Blog table for workshop
    BlogTable:
      Type: AWS::DynamoDB::Table
      DeletionPolicy: Retain
      Properties:
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
        TableName: ${self:provider.environment.TABLE_NAME}
```

### Create function and endpoints

* Create the function
```bash
sls create function -f posts --handler posts/index.handler
```

* Deploy

```bash
sls deploy
```

* Invoke/test deplyed function:

```bash
sls invoke -f posts
```

* Register HTTP endpoints by adding the following to the function definition in `serverless.yml`
```
    events:
      - http:
          path: posts
          method: get          
          cors: true
          integration: lambda
      - http:
          path: posts
          method: post
          cors: true
          integration: lambda
      - http:
          path: posts/{id}
          method: put
          cors: true
          integration: lambda
      - http:
          path: posts/{id}
          method: delete
          cors: true
          integration: lambda
```

### Implement the functionality

#### Create blog post to DynamoDB

```json
{
  "content": "Tässä hienon blogipostauksen alku...\n",
  "date": 1496153248516,
  "id": "1496153248516",
  "title": "Eka postaus"
}
```

#### Create BlogStorage.js on posts folder:

Edit `posts/BlogStorage.js`:

```javascript
'use strict';

class BlogStorage {
  constructor(dynamodb) {
    this.dynamodb = dynamodb;
    this.baseParams = {
      TableName: process.env.TABLE_NAME,
    };
  }

  // Get all posts
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  getPosts() {
    const params = Object.assign({}, this.baseParams, {
      AttributesToGet: [
        'id',
        'title',
        'content',
        'date',
      ],
    });

    return this.dynamodb.scan(params).promise();
  }

  // Add new post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  savePost(post) {
    return { post: '' }
  }

  // Edit post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  updatePost(id, post) {
    return { post: '' }
  }

  // Delete post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
  deletePost(id) {
    return { post: '' }
  }
}

module.exports = BlogStorage;
```

#### Implement get for posts

Edit `posts/index.js`:

```javascript
'use strict';

const BlogStorage = require('./BlogStorage');
const AWS = require('aws-sdk');

const config = {
  region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1',
};

const dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports.handler = (event, context, callback) => {
  const storage = new BlogStorage(dynamodb);

  switch (event.method) {
    case 'GET':
      storage.getPosts({})
        .then(response => callback(null, response))
        .catch(callback);
      break;
    default:
      callback(`Unknown method "${event.method}".`);
  }
};
```

### Deploy and test

* Run offline

Run serverless locally:

```bash
sls offline
```

Curl or browse to `http://localhost:3000/posts`

You should get previously created blog post from DynamoDB


* Deploy the resources (and functions) using

```
sls deploy
````

* Copy tests from `test/posts.js` in this repo to your service
* Run `serveless-mocha-plugin` tests

```
sls invoke test --region us-east-1 --stage dev
```

### Set up your blog application

* Launch the blog application
* Enter the service Url (https://..../posts). The service URL can be retrieved using
```
sls info
```

#### Enjoy, your ready to go!

# Feedback
mikael.puittinen@sc5.io
