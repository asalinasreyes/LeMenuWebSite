'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var config = require('../../config/environment');
var uuid = require('node-uuid');
var Payment = require('../payment.model');
var MenuModel = require('../../api/menuofrestaurant/menuofrestaurant.model');
var ObjectId = require('mongoose').Types.ObjectId;
var paypal = require('paypal-rest-sdk');

var PriceListModel = require('../price.model');

paypal.configure(config.paypal);


exports.startPayment = function(req, res) {
    if (req.body.methodpayment != 'paypal') {
        res.send(500, {
            'type': 'paymentNotAllow'
        });
    }


    var user_id = new ObjectId(req.body.user._id);
    var MenuID = new ObjectId(req.body.menuid);
    var restaurant_id = new ObjectId(req.body.restaurantid);
    var order_id = uuid.v1();
    var paymentOrder = new Payment({
        order_id: order_id,
        userid: user_id,
        restaurantid: restaurant_id,
        menuid: MenuID
    });

    var cancelUrl = config.paypal.cancel_url + order_id;
    var successUrl = config.paypal.return_url + order_id;



    PriceListModel.findOne({}, function(err, PriceList) {
        if (err) {
            return handleError(res, err);
        }

        if (!PriceList) {
            return res.send(500, {
                status: 'required ID'
            });
        }

        MenuModel.findById(MenuID, function(err, MenuInformation) {

            if (!MenuInformation) {
                return res.send(500, {
                    status: 'No Menu Encontrado'    
                });
            }


            var InformationPayment = {
                priceBypage: PriceList.price,
                numberPage: MenuInformation.files.length,
                numberLanguages: MenuInformation.language.length,
                Languages: PriceList.Languages,
                TotalPrice: PriceList.price * MenuInformation.files.length * MenuInformation.language.length
            };

            var paypalPayment = paypalJsonPayment(cancelUrl, successUrl, InformationPayment.TotalPrice, MenuInformation.language.toString());

            paymentOrder.save(function(err) {
                if (err) {
                    res.send(500, err);
                } else {
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
            });
        });
    });
};


exports.orderExecute = function(req, res) {
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

        MenuModel.findOne({
            _id: paymentOrderSuccess.menuid
        }, function(err, oneMenu) {
            if (err) return res.send(500, {
                error: err
            });
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
        order_id: req.query.order_id
    }, function(err, paymentOrderSuccess) {
        paymentOrderSuccess.state = 'cancel';
        paymentOrderSuccess.created_cancel = new Date();
        paymentOrderSuccess.save();
        res.redirect('/owner/payment/cancel');
    });

};

function paypalJsonPayment(cancelUrl, successUrl, price, description) {
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
                "total": price
            },
            "description": description
        }]
    };
    return paypalPayment;
}