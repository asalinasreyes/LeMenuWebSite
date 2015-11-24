'use strict';

var express = require('express');
var controller = require('./translationowner.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('owner') ,controller.index);
router.post('/getFile', auth.hasRole('owner') ,controller.getFile);
router.get('/viewTranslation', auth.hasRole('owner') ,controller.viewTranslation);
router.get('/AddComplaint', auth.hasRole('owner') ,controller.AddComplaint);
router.post('/ApprovedTranslation', auth.hasRole('owner') ,controller.ApprovedTranslation);


module.exports = router;