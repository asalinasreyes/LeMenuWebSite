
'use strict';
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('newrelic');
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);


console.log('ambiente de ejecucion :',process.env.NODE_ENV);
console.log('Borrar Base Activo ',config.seedDB);
// Populate DB with sample data
if(config.seedDB) {

 require('./config/seed'); 
}

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/expressConfig')(app);
require('./routes')(app);


// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;