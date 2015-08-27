'use strict';

var _ = require('lodash');
var PriceListModel = require('../../payment/price.model');
var MenuModel = require('../menuofrestaurant/menuofrestaurant.model');

// Get price Invoice
exports.index = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    console.log('consultando req.query.menuid', req.query.menuid);
    var MenuID = new ObjectId(req.query.menuid);

    if (!req.query.menuid) {
        return res.send(500, {
            status: 'required ID'
        });
    }
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
                    res.send(500, {
                        status: 'PriceList'
                    });
                }
            });
        }


        MenuModel.findOne({
            _id: MenuID
        }, function(err, MenuInformation) {
            if (err) {
                return handleError(res, err);
            }
            if (!MenuInformation) {
                return res.send(500, {
                    status: 'Menu not Found'
                });
            }
            var InformationPayment = {
                priceBypage: PriceList.price,
                numberPage: MenuInformation.files.length,
                numberLanguages: MenuInformation.language.length,
                Languages: MenuInformation.language,
                TotalLine: PriceList.price * MenuInformation.files.length,
                TotalPrice: PriceList.price * MenuInformation.files.length * MenuInformation.language.length
            };
            return res.json(200, InformationPayment);
        });
    });

};

function handleError(res, err) {
    return res.send(500, err);
}
