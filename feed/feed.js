'use strict';

const BlogStorage = require('../posts/BlogStorage');
const AWS = require('aws-sdk');
const RSS = require('rss');

const config = {
  region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1',
};

const dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports = () => {
  const storage = new BlogStorage(dynamodb);
  const feed = new RSS({
    title: 'my blog',
    feed_url: process.env.FEER_URL,
    site_url: 'http://hackathon-blog.sandbox.sc5.io/',
  });

  return storage.getPosts()
    .then((data) => {
      const sortedItems = data.Items.sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        } else if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
      sortedItems
        .reverse()
        .forEach((item) => {
          feed.item({
            title: item.title,
            description: item.content,
            url: `'http://hackathon-blog.sandbox.sc5.io/'${item.id}/`,
            date: item.date,
            author: 'me',
          });
        });
      return feed.xml({ indent: true });
    });
};
