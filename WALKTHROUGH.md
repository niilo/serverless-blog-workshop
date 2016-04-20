# SC5 Serverless Hackathon Walkthrough

This walktrough guides the reader to set up a backend 
for the blog application hosted at http://hackathon-blog.sandbox.sc5.io/ using the Serverless Framework.

A reference implementation is available at https://github.com/SC5/aws-serverless-hackathon-backend in case you get stuck.

## Prerequisites

 * AWS account (register at https://aws.amazon.com/free)
 * AWS account key + secret
 * AWS profile set up on laptop (see http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
 * Node 4 or 5 installed (latest stable release available from https://nodejs.org/en/download/stable/)
 * Serverless framework installed
```
	> npm install –g serverless
```

## Setting up the project and resources

 * Create the serverless project (we'll use the SC5 Serverless Boilerplate which has some plugins and templates preset)
```
    > sls project install -n="serverless-blog" sc5-serverless-boilerplate
    > cd serverless-blog
    > npm install
```
 * Create the DynamoDB table for blog posts either using the AWS console or by adding the following snippet 
 to "Resources" in s-resources-cf.json:
```
    "Dynamo": {
        "Type": "AWS::DynamoDB::Table",
        "DeletionPolicy": "Retain",
        "Properties": {
            "AttributeDefinitions": [
                {
                    "AttributeName": "id",
                    "AttributeType": "S"
                }
            ],
            "KeySchema": [
                {
                    "AttributeName": "id",
                    "KeyType": "HASH"
                }
            ],
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 1,
                "WriteCapacityUnits": 1
            },
            "TableName": "${stage}-blog"
        }
    }
    
    > sls resources deploy (You can also do that later)
```
 * Add rights to access DynamoDB to the IAMPolicyLambda (Role) either via AWS Console
  or by adding the following snippet to the policy statements in s-resouces.json (and deploy the resources)  
```
    {
        "Effect": "Allow",
        "Action": [
            "dynamodb:Scan",
            "dynamodb:PutItem",
            "dynamodb:DeleteItem"
        ],
        "Resource": "arn:aws:dynamodb:${region}:*:*"
    }
    
    > sls resources deploy
```

## Creating the function and endpoint

 * Add a serverless component 'blog' and function 'posts' for the endpoint
```
    > sls component create blog
    > sls function create blog/posts
```   
 * Update mapping for GET and add endpoints POST, PUT and DELETE to the file 'blog/posts/s-function.json',
 use the mappings defined in s-templates.json (in project root) in 'endpoints'. See example below 
 (copy the GET method and modify method and requestTemplates for each of the other methods and set path for PUT/DELETE to posts/{id})
```
    {
        "path": "posts",
        "method": "POST",
        "type": "AWS",
        "authorizationType": "none",
        "apiKeyRequired": false,
        "requestParameters": {},
        "requestTemplates": "$${restPost}",
        "responses": {
            "400": {
                "statusCode": "400"
            },
            "default": {
                "statusCode": "200",
                "responseParameters": {},
                "responseModels": {},
                "responseTemplates": {
                    "application/json": ""
                }
            }
        }
    }
```
 * Enable CORS headers for the function by adding the following to 'blog/posts/s-function.json' into 'custom'
```
    "cors": {
        "allowOrigin": "*",
        "allowHeaders": ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key"]
    }
``` 
 * Implement the logic for the API to e.g. 'blog/lib/index.js'. It is recommended to use AWS.DynamoDB.DocumentClient from the aws-sdk for the Dynamo DB connection. 
    Remember to set the region when instantiating DynamoDB. The mappings restGet, restPost, restPut and restDelete map
     - the method (GET, POST, PUT, DELETE) to event.method
     - the JSON payload (for POST / PUT) is mapped to event.body 
     - the id (for PUT/DELETE) is mapped to event.id
 * Setup event.json to test the endpoint for creating a new post and run it using sls function run
```
    event.json:
    {
        "method": "POST",
        "body": {
            "title": "Test post",
            "content" : "Test content"   
        }
    }
    
    > sls function run blog/posts
```
 * Deploy the function and endpoint
```
    > sls function deploy blog/posts
    > sls endpoint deploy --all    (this deploys also the CORS headers)
```

## Using the endpoint in the sample app
 * Launch the blog application at http://hackathon-blog.sandbox.sc5.io/ and insert the endpoint URL from the output of the 
  previous command (https://....amazonaws.com/dev/posts) as the endpoint URL and save the settings
 * Congrats, you did it!
