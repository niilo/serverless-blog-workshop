/**
 * Lib
 */

var blog = require('./blog_storage');

module.exports.respond = function(event, cb) {
    var post;
                
    switch(event.method) {
        case 'GET':
           blog.getPosts(cb);
           break;
        case 'POST':
            post = event.body || {};
            post.id = Date.now().toString();
            blog.savePost(post, cb);
            break;
        case 'PUT':
            post = event.body || {};
            post.id = event.id
            blog.savePost(post, cb);
            break;
        case 'DELETE':
            blog.deletePost(event.id, cb);
            break;
        default:
            cb('Invalid method ' + event.method);
    }
};

