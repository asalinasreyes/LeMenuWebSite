'use strict';

var _ = require('lodash');
var queueProcess = require('../../../payment/QueueProcess.model');
var translator = require('../translatorlanguage.model');
var restaurant = require('../../restaurant/restaurant.model');

// Obtine la lista de trabajos en estado pendiente
exports.index = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    translator.findOne({
        userid: user_id
    }, function(err, translateUser) {
        if (err) {
            return handleError(res, err);
        };
        queueProcess.find({
            IsReadyToTranslate: true,
            LanguagesTo: {
                '$in': translateUser.languages
            },
            UserTranslateid: {
                $exists: false
            }
        }).populate('Menuid', 'files language').exec(
            function(err, ListqueueProcess) {
                if (err) {
                    return handleError(res, err);
                }
                return res.json(200, ListqueueProcess);
            });
    })
};

//Get List of Menu Translation I'm working On iT
exports.ImWorkingOnIt = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);

    queueProcess.find({
            IsReadyToTranslate: true,
            UserTranslateid: user_id,
            IsDoneTranslate: false
        })
        .populate('Menuid', 'files language mame')
        .populate('Restaurantid')
        .exec(function(err, ListqueueProcess) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, ListqueueProcess);
        });
};


/*
Actualiza la informacion de una traduccion
*/
exports.updateTranslateMenuAndItemTranslate = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    var menu_id = new ObjectId(req.body.infomenuomenu._id);
    var info = req.body.infomenuomenu;

    queueProcess.findOne({
        _id: menu_id,
        UserTranslateid: user_id
    }, function(err, menu) {
        if (err) {
            return handleError(res, err);
        }
        if (!menu) {
            return res.send(404);
        }
        menu.MenuDetail = info.MenuDetail;
        menu.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, menu);
        });
    });
};



//Take One Translate from Queue as own, if person is free :-)
exports.updateAndTakeTranslatoasOwn = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);

    queueProcess.count({
        UserTranslateid: user_id,
        IsDoneTranslate: false
    }, function(err, count) {
        if (count == 0) {
            queueProcess.findById(req.params.id)
                .populate('Restaurantid')
                .exec(function(err, queueProcessInfo) {
                    if (err) {
                        return handleError(res, err);
                    }
                    if (!queueProcessInfo) {
                        return res.send(404);
                    }
                    queueProcessInfo.UserTranslateid = user_id;
                    queueProcessInfo.StartTranslate = Date.now();
                    queueProcessInfo.save(function(err) {
                        if (err) {
                            return handleError(res, err);
                        }
                        return res.json(200, queueProcessInfo);
                    });
                });
        } else {
            return res.json(304, {
                info: 'Busy'
            });
        }
    });
};

// Update status One Item in Queue in process, if is the parent let child ready to translate 
/* Marca un trabajo como  completada */
exports.FinnishedTranslation = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    var menu_id = new ObjectId(req.body.infomenuomenu._id);

    var info = req.body.infomenuomenu;

    queueProcess.findOne({
        _id: menu_id,
        UserTranslateid: user_id
    }, function(err, menu) {
        if (err) {
            return handleError(res, err);
        }
        if (!menu) {
            return res.send(404);
        }

        if (menu.IsParent == true) {
            ///agregar aca referencia a node original
            queueProcess.update({
                IsParent: false,
                Parentid: menu._id
            }, {
                IsReadyToTranslate: true,
                MenuDetail : menu.MenuDetail
            }, {
                upsert: true,
                multi: true
            }, function(err, doc) {});
        };
        menu.IsDoneTranslate = true;
        menu.EndTranslate = Date.now();

        menu.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, menu);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
