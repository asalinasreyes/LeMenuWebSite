'use strict';

var _ = require('lodash');
var Translatorlanguage = require('./translatorlanguage.model');

// Get list of translatorlanguages
exports.index = function(req, res) {
  Translatorlanguage.find(function (err, translatorlanguages) {
    if(err) { return handleError(res, err); }
    return res.json(200, translatorlanguages);
  });
};

// Get a single translatorlanguage
exports.show = function(req, res) {
  Translatorlanguage.findById(req.params.id, function (err, translatorlanguage) {
    if(err) { return handleError(res, err); }
    if(!translatorlanguage) { return res.send(404); }
    return res.json(translatorlanguage);
  });
};

// Creates a new translatorlanguage in the DB.
exports.create = function(req, res) {
  Translatorlanguage.create(req.body, function(err, translatorlanguage) {
    if(err) { return handleError(res, err); }
    return res.json(201, translatorlanguage);
  });
};

// Updates an existing translatorlanguage in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Translatorlanguage.findById(req.params.id, function (err, translatorlanguage) {
    if (err) { return handleError(res, err); }
    if(!translatorlanguage) { return res.send(404); }
    var updated = _.merge(translatorlanguage, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, translatorlanguage);
    });
  });
};

// Deletes a translatorlanguage from the DB.
exports.destroy = function(req, res) {
  Translatorlanguage.findById(req.params.id, function (err, translatorlanguage) {
    if(err) { return handleError(res, err); }
    if(!translatorlanguage) { return res.send(404); }
    translatorlanguage.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}