'use strict';


module.exports.handler = (event, context, cb) => {

    const blog = require('./blog_storage');
    let post;

    switch(event.method) {
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
          cb('not yet implemented ' + event.method);
  }
};
