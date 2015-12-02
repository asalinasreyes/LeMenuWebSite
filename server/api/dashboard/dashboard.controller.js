'use strict';

var _ = require('lodash');
var async = require('async');
var QueueSchemaProcess = require('../../payment/QueueProcess.model');
var PaymentSchemaInfo = require('../../payment/payment.model');

var Restaurant = require('../restaurant/restaurant.model');
var MenuOfrestaurant = require('../menuofrestaurant/menuofrestaurant.model');
var translator = require('../translatorlanguage/translatorlanguage.model');



exports.index = function(req, res) {
    var dashboardinfo;

    dashboardinfo = {};

    async.parallel({
        qtyPayed: function(callback) {
            return QueueSchemaProcess.count({
                IsParent: true
            }, function(err, result) {
                return callback(err, result);
            });
        },
        qtyTranslationPayed: function(callback) {
            return QueueSchemaProcess.count({
                IsParent: false
            }, function(err, result) {
                return callback(err, result);
            });
        },
        qtyRestaurant: function(callback) {
            return QueueSchemaProcess.aggregate([{
                $group: {
                    _id: "$Restaurantid"
                }
            }], function(err, result) {
                return callback(err, result.length);
            });
        },
        TotalPay: function(callback) {
            return PaymentSchemaInfo.aggregate([{
                $group: {
                    _id: '$state',
                    Total: {
                        $sum: '$amount'
                    }
                }
            }], function(err, result) {
                var sumTotalPayed = 0;
                for (var i = 0; i < result.length; i++) {
                    if (result[i]._id == 'success') {
                        sumTotalPayed = result[i].Total;
                    };
                };
                return callback(err, sumTotalPayed);
            });
        }
    }, function(err, dashboardinfo) {
        if (err) {
            return res.json(200, err);
        }
        //return res.json(200, dashboardinfo);
         return  res.status(200).json(dashboardinfo);
    });
};


exports.clearDatabase = function(req, res) {

    async.parallel({
            Restaurant: function(callback) {
                Restaurant.find({}).remove(function() {
                    return callback( true);
                });
            },
            Menu: function(callback) {
                MenuOfrestaurant.find({}).remove(function() {
                    return callback( true);
                });
            },
            Payment: function(callback) {
                PaymentSchemaInfo.find({}).remove(function() {
                    return callback( true);
                });
            },
            Queue: function(callback) {
                QueueSchemaProcess.find({}).remove(function() {
                    return callback( true);
                });
            }
        },
        function(err, clarAll) {
            if (err) {
                return res.json(200, err);
            };
            return res.json(200, clarAll);
        });
};


function handleError(res, err) {
    return res.send(500, err);
};
