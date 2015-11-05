'use strict';

var express = require('express');
var controller = require('./translationowner.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('owner') ,controller.index);
router.post('/getFile', auth.hasRole('owner') ,controller.getFile);


module.exports = router;