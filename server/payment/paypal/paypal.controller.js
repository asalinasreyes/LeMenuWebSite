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
    var restaurant_id = new ObjectId(req.body.Restaurantid);
    var order_id = uuid.v1();


    var paymentOrder = new Payment({
        order_id: order_id,
        userid: user_id,
        Restaurantid: restaurant_id,
        menuid: MenuID
    });

    console.log('paypal config', config.paypal);
    var cancelUrl = config.paypal.cancel_url + order_id;
    var successUrl = config.paypal.return_url + order_id;



    PriceListModel.findOne({}, function(err, PriceList) {
        if (err) {
            return handleError(res, err);
        }

        if (!PriceList) {
            PriceListModel.create({
                price: 11,
                typeserviceid: '1',
                typeservicedescription: 'todos',
                validFrom: new Date(),
                validTo: new Date()
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
            console.log('paypalPayment',paypalPayment);
            paymentOrder.amount = InformationPayment.TotalPrice;
            paymentOrder.state = 'pending-paypal';
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
                            console.log('paypal respondio', data);
                            var link = data.links;
                            var urlFromPaypalApproval_url = '';
                            for (var i = 0; i < link.length; i++) {
                                console.log('link paypal',i,  link[i].rel, link[i].href);
                                if (link[i].rel === 'approval_url') {
                                    urlFromPaypalApproval_url = link[i].href
                                }
                            }
                            console.log('paypal redirect', urlFromPaypalApproval_url);
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

        paymentOrderSuccess.state = 'success';
        paymentOrderSuccess.created_success = new Date();
        paymentOrderSuccess.save(function(err){

        });
        console.log('paymentOrderSuccess', paymentOrderSuccess);

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
                    IsDoneTranslate:false,
                    IsParent:true
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
                            IsDoneTranslate:false,
                            Parentid : Parent._id,
                            IsParent:false
                        };
                        queueTranslate.push(translateItemQueue);
                    });
                    console.log('pago QueueProcess');
                    QueueProcess.create(queueTranslate, function(err) {
                        if (err) {
                            res.send(500, err);
                        }
                        res.redirect('/owner/payment/success');
                    });
                });
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