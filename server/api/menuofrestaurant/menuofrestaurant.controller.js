'use strict';

var _ = require('lodash');
var Menuofrestaurant = require('./menuofrestaurant.model');

// Get list of menuofrestaurants
exports.index = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    Menuofrestaurant.find({
        'userid': user_id
    }, function(err, menuofrestaurants) {
        if (err) {
            return handleError(res, err);
        }
        //return res.json(200, menuofrestaurants);
        return  res.status(200).json(menuofrestaurants);
    });
};

// Get a single menuofrestaurant
exports.show = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);

    Menuofrestaurant.findOne({
        'userid': user_id,
        '_id': req.params.id
    }, function(err, menuofrestaurant) {
        if (err) {
            return handleError(res, err);
        }
        if (!menuofrestaurant) {
            return res.send(404);
        }
        return res.json(menuofrestaurant);
    });
};

// Creates a new menuofrestaurant in the DB.
exports.create = function(req, res) {
    req.body.userid = req.user._id;
    console.log('invocando a Menu create, files', req.body.files);
    Menuofrestaurant.create(req.body, function(err, menuofrestaurant) {        
        if (err) {
            return handleError(res, err);
        }
        res.status(201).json(menuofrestaurant);
        //return res.json(201, menuofrestaurant);
    });
};

// Updates an existing menuofrestaurant in the DB.
exports.update = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);


    if (req.user._id != req.body.userid) {
        return res.send(401);
    };

    if (req.body._id) {
        delete req.body._id;
    }



    Menuofrestaurant.findById(req.params.id, function(err, menuofrestaurant) {
        if (err) {
            return handleError(res, err);
        }
        if (!menuofrestaurant) {
            return res.send(404);
        }
        var updated = _.extend(menuofrestaurant, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, menuofrestaurant);
        });
    });
};

// Deletes a menuofrestaurant from the DB.
exports.destroy = function(req, res) {
    Menuofrestaurant.findById(req.params.id, function(err, menuofrestaurant) {
        if (err) {
            return handleError(res, err);
        }
        if (!menuofrestaurant) {
            return res.send(404);
        }
        menuofrestaurant.remove(function(err) {
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
