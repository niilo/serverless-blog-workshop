'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 */

// Require Logic
let lib = require('../lib');

// Lambda Handler
module.exports.handler = (event, context) => {
  lib.respond(event, context.done);
};