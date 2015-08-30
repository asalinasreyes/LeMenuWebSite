'use strict';

var express = require('express');
var controller = require('./queue.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('translate') , controller.index);
router.get('/ImWorkingOnIt', auth.hasRole('translate') , controller.ImWorkingOnIt);


router.post('/:id',auth.hasRole('translate'), controller.update);
router.patch('/:id', auth.hasRole('translate'), controller.update);

module.exports = router;