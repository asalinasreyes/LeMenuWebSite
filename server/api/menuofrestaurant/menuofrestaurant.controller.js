'use strict';

var _ = require('lodash');
var Menuofrestaurant = require('./menuofrestaurant.model');

// Get list of menuofrestaurants
exports.index = function(req, res) {
  Menuofrestaurant.find(function (err, menuofrestaurants) {
    if(err) { return handleError(res, err); }
    return res.json(200, menuofrestaurants);
  });
};

// Get a single menuofrestaurant
exports.show = function(req, res) {
  Menuofrestaurant.findById(req.params.id, function (err, menuofrestaurant) {
    if(err) { return handleError(res, err); }
    if(!menuofrestaurant) { return res.send(404); }
    return res.json(menuofrestaurant);
  });
};

// Creates a new menuofrestaurant in the DB.
exports.create = function(req, res) {
  console.log('creando el menuofrestaurant',req.body );
  Menuofrestaurant.create(req.body, function(err, menuofrestaurant) {
    console.log('Se crea registro menu ',menuofrestaurant );
    console.log('Se crea error  ', err );
    if(err) { return handleError(res, err); }
    return res.json(201, menuofrestaurant);
  });
};

// Updates an existing menuofrestaurant in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Menuofrestaurant.findById(req.params.id, function (err, menuofrestaurant) {
    if (err) { return handleError(res, err); }
    if(!menuofrestaurant) { return res.send(404); }
    var updated = _.merge(menuofrestaurant, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, menuofrestaurant);
    });
  });
};

// Deletes a menuofrestaurant from the DB.
exports.destroy = function(req, res) {
  Menuofrestaurant.findById(req.params.id, function (err, menuofrestaurant) {
    if(err) { return handleError(res, err); }
    if(!menuofrestaurant) { return res.send(404); }
    menuofrestaurant.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}