'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var config = require('../../config/environment');
var uuid = require('node-uuid');
var Payment = require('../payment.model');
var QueueProcess = require('../QueueProcess.model');
var MenuModel = require('../../api/menuofrestaurant/menuofrestaurant.model');
var restaurant = require('../../api/restaurant/restaurant.model');
var ObjectId = require('mongoose').Types.ObjectId;
var paypal = require('paypal-rest-sdk');
var config = require('../../config/environment');

var sendMail = require('../../api/mailer/mailer.controller');



var PriceListModel = require('../price.model');

paypal.configure(config.paypal);


console.log('Paypal fake es ', config.ALL_PROCESS_FAKE);
var fake_process = config.ALL_PROCESS_FAKE;


exports.startPayment = function(req, res) {
    if (req.body.methodpayment != 'paypal') {
        res.send(500, {
            'type': 'paymentNotAllow'
        });
    }
    var user_id = new ObjectId(req.body.user._id);
    var MenuID = new ObjectId(req.body.menuid);
    var restaurant_id = new ObjectId(req.body.Restaurantid);
    var order_id = uuid.v1();
    var paymentOrder = new Payment({
        order_id: order_id,
        userid: user_id,
        Restaurantid: restaurant_id,
        menuid: MenuID
    });
    var cancelUrl = config.paypal.cancel_url + order_id;
    var successUrl = config.paypal.return_url + order_id;

    PriceListModel.findOne({typeserviceid: '1'}, function(err, PriceList) {
        if (err) {
            return handleError(res, err);
        }

        if (!PriceList) {
            var oneYear = new Date();
            oneYear.setMonth(oneYear.getMonth() + 12);

            PriceListModel.create({
                price: 11,
                typeserviceid: '1',
                typeservicedescription: 'Price by 1 page (Image) transaction',
                validFrom: new Date(),
                validTo: oneYear
            }, function(err, PriceList) {
                if (err) {
                    res.send(500, err);
                }

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
            paymentOrder.amount = InformationPayment.TotalPrice;
            paymentOrder.state = 'pending-paypal';
            paymentOrder.save(function(err) {
                if (err) {
                    res.send(500, err);
                } else {
                    if (fake_process) {
                        GoPaypalFake(paypalPayment, res, req, order_id);
                    }else{
                        GoPaypal(paypalPayment, res, req);
                    }
                }
            });
        });
    });
};


exports.orderExecute = function(req, res) {
    Payment.findOne({
        order_id: req.query.order_id
    }, function(err, paymentOrderSuccess) {
        if (err) {
            return res.send(500, {
                error: err
            });
        }

        paymentOrderSuccess.state = 'success';
        paymentOrderSuccess.created_success = new Date();
        paymentOrderSuccess.save(function(err) {

        });

        MenuModel.findOne({
                _id: paymentOrderSuccess.menuid
            })
            .populate('Restaurantid')
            .exec(function(err, oneMenu) {
                if (err) return res.send(500, {
                    error: err
                });
                oneMenu.status = 'success';
                oneMenu.save();
                var FirstTranslate = {
                    Menuid: oneMenu._id,
                    LanguagesTo: oneMenu.Restaurantid.language,
                    LanguagesFrom: oneMenu.Restaurantid.language,
                    Restaurantid: oneMenu.Restaurantid,
                    Status: 'NotAssign',
                    IsReadyToTranslate: true,
                    IsDoneTranslate: false,
                    IsParent: true
                };
                var queueProcess = new QueueProcess(FirstTranslate);

                queueProcess.save(function(err, Parent) {
                    var queueTranslate = [];
                    oneMenu.language.forEach(function(lang) {
                        var translateItemQueue = {
                            Menuid: oneMenu._id,
                            LanguagesTo: lang,
                            Restaurantid: oneMenu.Restaurantid,
                            LanguagesFrom: oneMenu.Restaurantid.language,
                            IsReadyToTranslate: false,
                            IsDoneTranslate: false,
                            OwnerApproved:false,
                            Parentid: Parent._id,
                            IsParent: false
                        };
                        queueTranslate.push(translateItemQueue);
                    });
                    QueueProcess.create(queueTranslate, function(err) {

                        if (err) {
                            res.send(500, err);
                        }

                        sendMail.PaymentDone(oneMenu.Restaurantid.userid, oneMenu.Restaurantid.language);
                        if (fake_process) {
                            res.redirect('/owner/payment/success');
                        }else{
                            res.redirect('/owner/payment/success');
                        }
                    });
                });
            });
    });

};

exports.cancelUrl = function(req, res) {
    Payment.findOne({
        order_id: req.query.order_id
    }, function(err, paymentOrderSuccess) {
        paymentOrderSuccess.state = 'cancel';
        paymentOrderSuccess.created_cancel = new Date();
        paymentOrderSuccess.save();
        if (fake_process) {
            res.redirect('/owner/payment/cancel');
        }else{
            res.redirect('/owner/payment/cancel');
        }
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
};


function GoPaypalFake(paypalPayment, res, req, order_id) {
    paypalPayment.redirectUrl = '/fakePAYPAL';
    paypalPayment.TOKEN_Transaction = order_id;
    return res.status(200).json(paypalPayment);

};

function GoPaypal(paypalPayment, res, req) {
    paypal.payment.create(paypalPayment, {},
        function(err, data) {
            if (err) {
                res.status(503).send({
                    description: 'Error setting paypal payment',
                    error: err
                });
            } else {
                if (data && data.links.length > 0) {
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
                } else {
                    res.status(503).send({
                        description: 'Error setting paypal payment',
                        error: 'OFFLINE'
                    });
                }
            }
        });
};
