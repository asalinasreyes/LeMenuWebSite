'use strict';

var _ = require('lodash');
var queueProcess = require('../../../payment/QueueProcess.model');
var translator = require('../translatorlanguage.model');
var restaurant = require('../../restaurant/restaurant.model');

// Get list Queue Translate Pending
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


exports.ImWorkingOnIt = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);

    queueProcess.find({
            IsReadyToTranslate: true,
            UserTranslateid: user_id
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


exports.updateTranslateMenuAndItemTranslate = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    var menu_id = new ObjectId(req.body.infomenuomenu._id);

    var info = req.body.infomenuomenu;

    console.log(info);

    queueProcess.findById(menu_id, function(err, menu) {
        if (err) {
            return handleError(res, err);
        }
        if (!menu) {
            return res.send(404);
        }
        if (info._id) {
            delete info._id;
        }
        if (info.Restaurantid) {
            delete info.Restaurantid;
        }
        
        menu.MenuDetail =  req.body.infomenuomenu.MenuDetail;

        //var updated = _.extend(menu, req.body.infomenuomenu);

        menu.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, menu);
        });
    });

    /*
        return res.json(200, {result:req.body});
    */

};



//Take One Translate from Queue as own, if Im free :-)
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


function handleError(res, err) {
    return res.send(500, err);
}