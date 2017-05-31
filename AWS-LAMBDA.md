# AWS LAMBDA INTRO

## LAMBDA EXAMPLE: CALCULATOR

Open AWS Console / Lambda
- Create new function
- Name: ”Calculator”
- Copy code from the right
- Role: Create new role ”Basic execution role”
- Once created, test with e.g. sample test from the right
- Logs available in Cloudwatch

LAMBDA:
```javascript
exports.handler = function(event, context) {
  console.log('a =', event.a);
  console.log('b =', event.b);
  context.succeed({
    sum: event.a + event.b
  });
};
```

TEST:
```javascript
{
  "a": 10,
  "b": 20
}
```

## API GATEWAY EXAMPLE

Launch API Gateway from AWS Console
- Create API ”Calculator”
- Create resourse ”calculator” (from Actions)
- Create ”POST” method for calculator resource
- Integration type: Lambda Function
- Deploy API to stage ”v1”
- Copy URL displayed for resource
- Test API with e.g. Postman
