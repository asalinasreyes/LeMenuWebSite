'use strict';

var express = require('express');
var controller = require('./menuofrestaurant.controller');

var config = require('../../config/environment');
var auth = require('../../auth/auth.service');



var router = express.Router();

router.get('/', auth.hasRole('owner'), controller.index);
router.get('/:id', auth.hasRole('owner'), controller.show);
router.post('/', auth.hasRole('owner'), controller.create);
router.put('/:id', auth.hasRole('owner'), controller.update);
router.patch('/:id', auth.hasRole('owner'), controller.update);
router.delete('/:id', auth.hasRole('owner'), controller.destroy);

module.exports = router;
