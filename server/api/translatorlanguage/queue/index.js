'use strict';

var express = require('express');
var controller = require('./queue.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('translate') , controller.index);
router.get('/ImWorkingOnIt', auth.hasRole('translate') , controller.ImWorkingOnIt);


router.post('/menuAndItems',auth.hasRole('translate'), controller.updateTranslateMenuAndItemTranslate);


router.post('/:id',auth.hasRole('translate'), controller.updateAndTakeTranslatoasOwn);
router.patch('/:id', auth.hasRole('translate'), controller.updateAndTakeTranslatoasOwn);

module.exports = router;