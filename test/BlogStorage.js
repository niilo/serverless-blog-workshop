'use strict';
// Tests for Blog Storage

const BlogStorage = require('../blog/posts/BlogStorage');
const expect = require('chai').expect;

// Set up our mock DynamoDB class
class MockDynamoDB {
  constructor() {
    this.posts = {};
  }

  put(params, cb) {
    this.posts[params.Item.id] = params.Item;
    cb(null, params.Item);
  }

  scan(params, cb) {
    // Compile the local hash as array
    const posts = [];
    for (const n in this.posts) {
      posts.push(this.posts[n]);
    }

    cb(null, {
      Items: posts,
      Count: posts.length,
      ScannedCount: posts.length
    });
  }

  delete(params, cb) {
    delete this.posts[params.id];
    cb(null, {});
  }
}

// Use Mock DynamoDB as database for BlogStorage
let blog = new BlogStorage(new MockDynamoDB());

describe('BlogStorage', () => {
  let postId;

  it('#savePost', (done) => {
    blog.savePost({
      title: 'Test',
      content: 'Hello, world!'
    }, (err, response) => {
      expect(err).to.be.null;
      postId = response.post.id;
      expect(response.post.id).to.be.not.null;
      done();
    });
  });

  it('#getPosts', (done) => {
    blog.getPosts({}, (err, response) => {
      expect(err).to.be.null;
      expect(response.Items).to.be.not.null;
      expect(response.Items.length > 0).to.be.true;
      // find our post
      let post = false;
      for (let idx in response.Items) {
        if (response.Items[idx].id == postId) {
          post = response.Items[idx];
        }
      }
      expect(post).to.not.be.false;
      expect(post.title).to.be.equal("Test");
      expect(post.content).to.be.equal("Hello, world!");
      done();
    });
  });

  it('#updatePost', (done) => {
    blog.updatePost(postId, {
      title: 'Updated Test',
      content: 'Hello, Mocha!'
    }, (err, response) => {
      expect(err).to.be.null;
      expect(response.post.title).to.be.equal("Updated Test");
      expect(response.post.content).to.be.equal("Hello, Mocha!");
      done();
    });
  });

  it('#deletePost', (done) => {
    blog.deletePost(postId, (err, response) => {
      expect(err).to.be.null;
      done();
    });
  });
});
