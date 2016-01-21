'use strict';

// Development specific configuration
// ==================================
module.exports = {
  
  mongo: {
    uri: 'mongodb://localhost/lemenu-dev'
  },

  seedDB: true,
  seedOnlyUser: true,
  ALL_PROCESS_FAKE:true
};
