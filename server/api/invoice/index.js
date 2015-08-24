'use strict';

var express = require('express');
var controller = require('./invoice.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.hasRole('owner'), controller.index);

module.exports = router;
