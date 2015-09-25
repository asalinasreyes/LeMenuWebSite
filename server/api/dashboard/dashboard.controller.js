'use strict';

var _ = require('lodash');
var async = require('async');
var QueueSchemaProcess = require('../../payment/QueueProcess.model');
var PaymentSchemaInfo  = require('../../payment/payment.model');

exports.index = function(req, res) {
    var dashboardinfo;

    dashboardinfo = {};

    async.parallel({
        qtyPayed: function(callback) {
            return QueueSchemaProcess.count({IsParent:true}, function(err, result) {
                return callback(err, result);
            });
        },
        qtyTranslationPayed: function(callback) {
            return QueueSchemaProcess.count({IsParent:false}, function(err, result) {
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
                    Total:{$sum:'$amount'}
                }
            }], function(err, result) {
                var sumTotalPayed = 0;
                console.log('total pagado es', result);
                for (var i = 0; i < result.length; i++) {
                     if (result[i]._id=='success') {
                        sumTotalPayed = result[i].Total;
                     };
                 }; 
                return callback(err, sumTotalPayed);
            });
        }
    }, function(err, dashboardinfo) {
        if (err) {
            return res.json(200, err);    
        };
        console.log('resultado ', dashboardinfo);
        return res.json(200, dashboardinfo);
    });

};

function handleError(res, err) {
    return res.send(500, err);
};
