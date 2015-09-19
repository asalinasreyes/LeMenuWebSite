'use strict';

var _ = require('lodash');
var Payment = require('../../payment/payment.model');

// Get list of Payment
exports.index = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);

    Payment.find()
        .populate('Restaurantid', 'name city createdat' )
        .populate('menuid', 'files language createdat')
        .exec(function(err, listPayments) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, listPayments);
        });
};


function handleError(res, err) {
    return res.send(500, err);
}
