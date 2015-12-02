'use strict';

var _ = require('lodash');
var queueProcess = require('../../../payment/QueueProcess.model');
var translator = require('../translatorlanguage.model');
var restaurant = require('../../restaurant/restaurant.model');

var complaintModel = require('../../../payment/Complaint.model');

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
                return res.status(200).json(ListqueueProcess);
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


            complaintModel.find({
                    $or: [{
                        Status: 'open'
                    }, {
                        Status: 'done'
                    }]
                })
                .exec(function(err, listComplaint) {
                    if (err) {
                        return handleError(res, err);
                    }

                    var result = ListqueueProcess.map(function(doc) {

                        return ({
                            _id: doc._id,
                            UserTranslateid: doc.UserTranslateid,
                            TranslationNumber: doc.TranslationNumber,
                            StartTranslate: doc.StartTranslate,
                            Restaurantid: doc.Restaurantid,
                            Parentid: doc.Parentid,
                            OwnerApproved: doc.OwnerApproved,
                            Menuid: doc.Menuid,
                            MenuDetail: doc.MenuDetail,
                            LanguagesTo: doc.LanguagesTo,
                            LanguagesFrom: doc.LanguagesFrom,
                            IsReadyToTranslate: doc.IsReadyToTranslate,
                            IsParent: doc.IsParent,
                            IsDoneTranslate: doc.IsDoneTranslate,
                            EndTranslate: doc.EndTranslate,
                            Createdat: doc.Createdat,
                            Complaints: _.where(listComplaint, {
                                QueueTranslationID: doc._id
                            })
                        });

                    });
                    return res.status(200).json(result);
                });
            //return res.json(200, ListqueueProcess);
        });
};


///Lista las traducciones que he terminado
exports.GetListTranslationDone = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);

    queueProcess.find({
            IsReadyToTranslate: true,
            UserTranslateid: user_id,
            IsDoneTranslate: true
        }, {
            TranslationNumber: '',
            EndTranslate: '',
            LanguagesFrom: '',
            LanguagesTo: '',
            Menuid: ''
        })
        .populate('Menuid', 'files')
        .populate('Restaurantid', 'name')
        .sort({
            EndTranslate: 'desc'
        })
        .exec(function(err, ListqueueProcess) {
            if (err) {
                return handleError(res, err);
            }
            complaintModel.find({
                    $or: [{
                        Status: 'open'
                    }, {
                        Status: 'done'
                    }]
                })
                .exec(function(err, listComplaint) {
                    if (err) {
                        return handleError(res, err);
                    }

                    var result = ListqueueProcess.map(function(doc) {

                        return ({
                            TranslationNumber: doc.TranslationNumber,
                            EndTranslate: doc.EndTranslate,
                            LanguagesFrom: doc.LanguagesFrom,
                            LanguagesTo: doc.LanguagesTo,
                            qtyImages: doc.Menuid.files.length,
                            Complaints: _.where(listComplaint, {
                                QueueTranslationID: doc._id
                            })
                        });

                    });
                    return res.status(200).json(result);
                });
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
            return res.status(200).json(menu);
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
                        return res.status(200).json(queueProcessInfo);
                    });
                });
        } else {
            return res.status(304).json({
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
            queueProcess.update({
                IsParent: false,
                Parentid: menu._id
            }, {
                IsReadyToTranslate: true,
                MenuDetail: menu.MenuDetail
            }, {
                upsert: true,
                multi: true
            }, function(err, doc) {});
        };
        menu.IsDoneTranslate = true;
        menu.EndTranslate = Date.now();
        menu.OwnerApproved = false;

        menu.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(menu);
        });
    });
};


exports.StartFixComplaint = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    var queue_id = new ObjectId(req.body.queue_id);
    var complaint_id = new ObjectId(req.body.complaint_id);

    complaintModel.findOne({
            _id: complaint_id
        })
        .exec(function(err, OneComplaint) {
            if (err) {
                return handleError(res, err);
            }

            OneComplaint.Status = 'done'
            OneComplaint.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                queueProcess.findOne({
                    _id: queue_id,
                    UserTranslateid: user_id
                }, function(err, menu) {
                    if (err) {
                        return handleError(res, err);
                    }

                    menu.IsDoneTranslate = false;
                    menu.EndTranslate = Date.now();
                    menu.save(function(err) {
                        if (err) {
                            return handleError(res, err);
                        }
                        return res.status(200).json(menu);
                    });
                });
            });
        });
};

exports.CloseComplaint = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    var complaint_id = new ObjectId(req.body.complaint_id);
    var queue_id = new ObjectId(req.body.queue_id);
    
    complaintModel.findOne({
            _id: complaint_id
        })
        .exec(function(err, OneComplaint) {
            if (err) {
                return handleError(res, err);
            }

            OneComplaint.Status = 'close'
            OneComplaint.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }

                queueProcess.findOne({
                    _id: queue_id,
                    UserTranslateid: user_id
                }, function(err, menu) {
                    if (err) {
                        return handleError(res, err);
                    }

                    menu.IsDoneTranslate = true;
                    menu.EndTranslate = Date.now();
                    menu.save(function(err) {
                        if (err) {
                            return handleError(res, err);
                        }
                        return res.status(200).json(menu);
                    });
                });


                
            });
        });
};



function handleError(res, err) {
    return res.send(500, err);
}
