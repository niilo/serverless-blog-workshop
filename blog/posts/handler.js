const blog = require('./blog_storage');

module.exports.handler = function handler(event, context, cb) {
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
      cb(`not yet implemented ${event.method}`);
  }
};
