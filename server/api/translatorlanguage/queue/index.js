'use strict';

var express = require('express');
var controller = require('./queue.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('translate') , controller.index);
router.get('/ImWorkingOnIt', auth.hasRole('translate') , controller.ImWorkingOnIt);
router.get('/GetListTranslationDone', auth.hasRole('translate') , controller.GetListTranslationDone);



router.post('/menuAndItems',auth.hasRole('translate'), controller.updateTranslateMenuAndItemTranslate);
router.post('/FinnishedTranslation',auth.hasRole('translate'), controller.FinnishedTranslation);
router.post('/StartFixComplaint',auth.hasRole('translate'), controller.StartFixComplaint);
router.post('/CloseComplaint',auth.hasRole('translate'), controller.CloseComplaint);


router.post('/:id',auth.hasRole('translate'), controller.updateAndTakeTranslatoasOwn);
router.patch('/:id', auth.hasRole('translate'), controller.updateAndTakeTranslatoasOwn);

module.exports = router;