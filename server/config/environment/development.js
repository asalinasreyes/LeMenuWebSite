'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/lemenu-dev'
  },

  seedDB: false,
  seedOnlyUser: true
};
