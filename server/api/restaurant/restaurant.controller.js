'use strict';

var _ = require('lodash');
var Restaurant = require('./restaurant.model');

// Get list of Restaurants
exports.index = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    Restaurant.find({
        'userid': user_id
    }, function(err, restaurants) {
        if (err) {
            return handleError(res, err);
        }
        //console.log("Encontrados ", restaurants);
        return res.json(200, restaurants);
    });

};

// Get a single Restaurant
exports.show = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    
    Restaurant.findOne({
        'userid': user_id,
        '_id': req.params.id
    }, function(err, Restaurant) {
        if (err) {
            return handleError(res, err);
        }
        if (!Restaurant) {
            return res.send(404);
        }
        return res.json(Restaurant);
    });
};

// Creates a new Restaurant in the DB.
exports.create = function(req, res) {

    req.body.userid = req.user._id;
    Restaurant.create(req.body, function(err, Restaurant) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, Restaurant);
    });
};

// Updates an existing Restaurant in the DB.
exports.update = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);


    if (req.user._id != req.body.userid) {
        return res.send(401);
    };

    if (req.body._id) {
        delete req.body._id;
    }

    Restaurant.findById(req.params.id, function(err, Restaurant) {
        if (err) {
            return handleError(res, err);
        }
        if (!Restaurant) {
            return res.send(404);
        }
        var updated = _.extend(Restaurant, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, Restaurant);
        });
    });
};

// Deletes a Restaurant from the DB.
exports.destroy = function(req, res) {
    Restaurant.findById(req.params.id, function(err, Restaurant) {
        if (err) {
            return handleError(res, err);
        }
        if (!Restaurant) {
            return res.send(404);
        }
        Restaurant.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
