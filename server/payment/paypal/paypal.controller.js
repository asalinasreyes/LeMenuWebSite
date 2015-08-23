'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var config = require('../../config/environment');
var uuid = require('node-uuid');
var Payment = require('../payment.model');
var Menuofrestaurant = require('../../api/menuofrestaurant/menuofrestaurant.model');
var ObjectId = require('mongoose').Types.ObjectId;
var paypal = require('paypal-rest-sdk');

paypal.configure(config.paypal);


exports.startPayment = function(req, res) {

    if (req.body.methodpayment == 'paypal') {
        console.log('resive en startment ', req.body);
        var user_id = new ObjectId(req.body.user._id);
        var menu_id = new ObjectId(req.body.menuid);
        var restaurant_id = new ObjectId(req.body.restaurantid);
        var order_id = uuid.v1();
        var paymentOrder = new Payment({
            order_id: order_id,
            userid: user_id,
            restaurantid: restaurant_id,
            menuid: menu_id
        });



        paymentOrder.save(function(err) {
            if (err) {
                res.send(500, err);
            } else {

                var cancelUrl = config.paypal.cancel_url + order_id;
                var successUrl = config.paypal.return_url + order_id;


                var paypalPayment = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        return_url: successUrl,
                        cancel_url: cancelUrl
                    },
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": 1000
                        },
                        "description": "Traduccion"
                    }]
                };
                paypal.payment.create(paypalPayment, {},
                    function(err, data) {
                        if (err) {
                            res.status(500).send('Error setting paypal payment');
                            return;
                        }
                        var link = data.links;
                        var urlFromPaypalApproval_url = '';
                        for (var i = 0; i < link.length; i++) {
                            if (link[i].rel === 'approval_url') {
                                urlFromPaypalApproval_url = link[i].href
                            }
                        }
                        res.send({
                            redirectUrl: urlFromPaypalApproval_url
                        });
                    });
            }
        })

    } else {
        res.send(500, {
            'type': 'paymentNotAllow'
        });
    }
};


exports.orderExecute = function(req, res) {
    console.log('query aproved values', req.query);
    Payment.findOne({
        order_id: req.query.order_id
    }, function(err, paymentOrderSuccess) {
        console.log('encontro la informacion de pago', paymentOrderSuccess);
         if (err) return res.send(500, {
                error: err
            });

        paymentOrderSuccess.state = '';
        paymentOrderSuccess.state = 'success';
        paymentOrderSuccess.created_success = new Date();
        paymentOrderSuccess.save();
        console.log('busco menu id',  paymentOrderSuccess.menuid);

        Menuofrestaurant.findOne({_id: paymentOrderSuccess.menuid}, function(err, oneMenu) {
            if (err) return res.send(500, {
                error: err
            });
            console.log('intento actualizar el registro ', oneMenu);
            oneMenu.status = '';
            oneMenu.status = 'success';
            oneMenu.save();
            res.redirect('/owner/payment/success');
        });
    });

};

exports.cancelUrl = function(req, res) {
    console.log('llamando a api paypal order callback orderExecute');
    Payment.findOne({
        order_id: order_id
    }, function(err, paymentOrderSuccess) {
        paymentOrderSuccess.state = 'cancel';
        paymentOrderSuccess.created_cancel = new Date();
        res.redirect('/owner/payment/cancel');
    });

};