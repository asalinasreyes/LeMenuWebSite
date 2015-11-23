'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: process.env.seedDB || false,
  seedOnlyUser: process.env.seedOnlyUser || false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'le-me-nu-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin','translator','owner'],


  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  },

  paypal: {
    host: process.env.PAYPAL_HOST || 'host paypal',
    port: process.env.PAYPAL_PORT || '',
    client_id: process.env.PAYPAL_CLIENT_ID || 'client id paypal',
    client_secret: process.env.PAYPAL_CLIENT_SECRET || 'paypal client secret paypal',
    return_url: (process.env.DOMAIN_FULLNAME || '') +  "/api/payment/paypal/orderExecute?order_id=",
    cancel_url: (process.env.DOMAIN_FULLNAME || '') +  "/api/payment/paypal/cancelUrl?status=cancel&order_id="
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});