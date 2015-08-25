'use strict';

var express = require('express');
var paypalcontroller = require('./paypal/paypal.controller');
var auth = require('../auth/auth.service');

var router = express.Router();

router.post('/paypal/startPayment',  paypalcontroller.startPayment);
router.get('/paypal/orderExecute',  paypalcontroller.orderExecute);
router.get('/paypal/cancelUrl',  paypalcontroller.cancelUrl);


module.exports = router;