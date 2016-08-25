const blog = require('./blog_storage');

module.exports.create = function createPost(event, context, cb) {
  blog.savePost(event, cb);
}

module.exports.get = function getPosts(event, context, cb) {
  blog.getPosts(event, cb);
}

module.exports.update = function updatePost(event, context, cb) {
  blog.savePost(event, cb);
}

module.exports.remove = function removePost(event, context, cb) {
  blog.deletePost(event, cb);
}
