'use strict';

var express = require('express');
var controller = require('./payment.controller');
var auth = require('../auth/auth.service');

var router = express.Router();

router.get('/',  controller.startPayment);
router.get('/orderExecute', controller.orderExecute);

module.exports = router;