'use strict';

var _ = require('lodash');
var Payment = require('../../payment/payment.model');

// Get list of Payment
exports.index = function(req, res) {
    console.log('Estoy aca en list payments user', req.user);
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    Payment.find({'userid': user_id}, function(err, listPayments) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, listPayments);
    });
};


function handleError(res, err) {
    return res.send(500, err);
}
