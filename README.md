# Serverless Blog Workshop by SC5

Example backend project for AWS - Serverless hackathon.

Project is compatible with Serverless v1

## Test AWS settings

```bash
mkdir awstest
cd awstest
npm install aws-sdk
node awstest.js
```

paste following:

```javascript
var AWS = require('aws-sdk')
var IAM = new AWS.IAM()
IAM.getUser(function (err, data) {
  console.log(data)
})
```

You should get your IAM account data.


## Step by step instructions for building the project with Serverless Framework v1.5

### Install serverless

```bash
npm install -g serverless
```

### Setup project

* Create the service from the `sc5-serverless-boilerplate`, change name my-serverless-blog to something unique:
```bash
> sls install -u https://github.com/SC5/sc5-serverless-boilerplate -n my-serverless-blog
> cd my-serverless-blog
> npm install
```

### Set up AWS profile and default region

Add defalt profile and region configuration to `serverless.yml` provider definition:

```
provider:
  ...
  profile: at-dev-aws
  region: eu-west-1
```

### Set up storage (DynamoDB)

* Un-comment `Resources:` and `resources:` in `serverless.yml`.

```
resources:
  Resources:
    SessionsTable:
      Type: AWS::DynamoDB::Table
      DeletionPolicy: Delete
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

### Run offline and redeploy

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

### Fast forward with frontend

Replace `my-`with your name or nick:

```bash
git clone git@github.com:niilo/aws-serverless-hackathon.git my-serverless-blog-frontend
cd my-serverless-blog-frontend
npm install
```

Change npm package name `package.json` to match project name `my-serverless-blog-frontend`

Configure Blog backend `https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/dev/posts` url by editting `app/config.ts` file.

You can get your Serverless backend url using command `sls info` in backend-project folder.

* To deploy frontend web application to S3 run

```bash
npm run deploy-stack
```

which creates a S3 bucket with website hosting to your default region.

To create bucket to custom region with custom CloudFormation stack name, use parameter -r for region and -n for stack name e.g.

```bash
npm run deploy-stack -- -r eu-west-1 -n my-serverless-blog-frontend
```

* Check that frontend works with backend

deploy-stack command returns website url. Browse there and you shold see one blog post :)

* Remove from S3 (after workshop)

```bash
npm run remove-stack
```

If you've defined custom region or stack name, same -r and -n parameters should be used when removing application.

### Implement missing functionality

Switch to backend and add missing functionality to `posts/BlogStorage.js` and `posts/index.js`.

You can develop frontend with offline Serverless by just starting backend with `sls offline` and configuring frontend to connect local backend edit `app/config.ts` to point `http://localhost:3000/posts` then you can start frontend locally with `npm start`


### Test


* Copy tests from `test/posts.js` in this repo to your service
* Run `serveless-mocha-plugin` tests

```
sls invoke test --region us-east-1 --stage dev
```

### Cleanup

* Remove serverless backend:

```bash
sls remove
```

* Delete frontend:

You might need to use -r -n options if stack was created with them..

```bash
npm run remove-stack
```

### Next steps:

Serverless BEER:
https://www.netlify.com/blog/2016/09/15/serverless-jam---a-serverless-framework-tutorial/
https://www.netlify.com/blog/2016/10/13/serverless-jam---a-serverless-framework-tutorial-part-2/

Official examples:
https://github.com/serverless/examples

Accenture TechArch serverless workshop:
https://github.com/niilo/tad2017

And the best for last?
http://serverless-stack.com/

#### Enjoy, your ready to go!

# Feedback
mikael.puittinen@sc5.io
