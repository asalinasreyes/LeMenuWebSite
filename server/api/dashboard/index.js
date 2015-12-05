'use strict';

var express = require('express');
var controller = require('./dashboard.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/Restaurants', auth.hasRole('admin'), controller.GetListRestaurants);
router.get('/Menus', auth.hasRole('admin'), controller.GetListMenus);
router.get('/MenusByIDResto', auth.hasRole('admin'), controller.GetListMenusByIDResto);
router.get('/Payments', auth.hasRole('admin'), controller.GetListPayments);
router.get('/Complaint', auth.hasRole('admin'), controller.GetListComplaint);



router.get('/clearDatabase', auth.hasRole('admin'), controller.clearDatabase);

module.exports = router;
