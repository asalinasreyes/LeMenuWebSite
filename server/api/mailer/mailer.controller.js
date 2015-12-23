'use strict';

var _ = require('lodash');
var async = require('async');
var QueueSchemaProcess = require('../../payment/QueueProcess.model');
var Restaurant = require('../restaurant/restaurant.model');
var MenuOfrestaurant = require('../menuofrestaurant/menuofrestaurant.model');
var translator = require('../translatorlanguage/translatorlanguage.model');
var usersSchema = require('../user/user.model');

var nodemailer = require('nodemailer');
var pickupTransport = require('nodemailer-pickup-transport');

var smtpTransport = require('nodemailer-smtp-transport');


var options = {
    directory: 'C:\\Projects\\inacap\\srcWebSiteLeMeNU\\Pickup'
};

var transporter = nodemailer.createTransport(pickupTransport(options))

//var transporter = nodemailer.createTransport({});
var NAME_EMAIL_FROM = 'info@lemenu.me';

exports.PaymentDone = function(OwnerID, language) {
    console.log('payment done');
    usersSchema.findOne({
        _id: OwnerID
    }, function(err, ownerInformation) {
        transporter.sendMail({
            from: NAME_EMAIL_FROM,
            to: ownerInformation.email,
            subject: 'PaymentDone',
            text: ownerInformation.name + '<br>' + language
        });
    });
};

exports.StartTranslation = function(OwnerID, language) {
    usersSchema.findOne({
        _id: OwnerID
    }, function(err, ownerInformation) {
        transporter.sendMail({
            from: NAME_EMAIL_FROM,
            to: ownerInformation.email,
            subject: 'StartTranslation',
            text: ownerInformation.name + '<br>' + language
        });
    });
};

exports.DoneTranslation = function(OwnerID, language) {
    usersSchema.findOne({
        _id: OwnerID
    }, function(err, ownerInformation) {
        transporter.sendMail({
            from: NAME_EMAIL_FROM,
            to: ownerInformation.email,
            subject: 'DoneTranslation',
            text: ownerInformation.name + '<br>' + language
        });
    });
};


exports.ComplaintCreated = function(OwnerID, TranslatorID, language) {
    usersSchema.findOne({
        _id: OwnerID
    }, function(err, ownerUser) {
        transporter.sendMail({
            from: NAME_EMAIL_FROM,
            to: ownerUser.email,
            subject: 'Complaint Created',
            text: ownerUser.name + '<br>' + language
        });

        usersSchema.findOne({
            _id: TranslatorID
        }, function(err, translatorUser) {
            transporter.sendMail({
                from: NAME_EMAIL_FROM,
                to: translatorUser.email,
                subject: 'Complaint Created',
                text: translatorUser.name + '<br>' + language
            });
        });


    });
};

exports.ComplaintClose = function(OwnerID, language) {
    usersSchema.findOne({
        _id: OwnerID
    }, function(err, ownerInformation) {
        transporter.sendMail({
            from: NAME_EMAIL_FROM,
            to: ownerInformation.email,
            subject: 'Complaint Close',
            text: ownerInformation.name + '<br>' + language
        });
    });
};
