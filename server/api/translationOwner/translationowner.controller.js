'use strict';

var _ = require('lodash');
var Restaurant = require('../restaurant/restaurant.model');
var QueueTranslate = require('../../payment/QueueProcess.model');
var Complaint = require('../../payment/Complaint.model');
var os = require("os");


var http = require('http');
var fs = require('fs');
var path = require('path');

// Get list of Translation
exports.index = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    Restaurant.find({
        'userid': user_id
    }, {
        _id: 1
    }, function(err, restaurants) {
        if (err) {
            return handleError(res, err);
        }
        var arrayResto = [];
        restaurants.map(function(resto) {
            var restoID = new ObjectId(resto._id);
            arrayResto.push(restoID);
        });

        var search = {
            'Restaurantid': {
                $in: arrayResto
            },
            'IsParent': false
        };


        var returnFields = {
            LanguagesTo: '',
            StartTranslate: '',
            EndTranslate: '',
            IsReadyToTranslate: '',
            IsDoneTranslate: '',
            Menuid: '',
            Restaurantid: '',
            TranslationNumber: '',
            OwnerApproved: ''
        };

        QueueTranslate.find(search, returnFields)
            .populate('Menuid', 'name')
            .populate('Restaurantid', 'name')
            .sort({
                TranslationNumber: -1
            })
            .exec(function(err, listQueue) {

                Complaint.find({
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

                        var result = listQueue.map(function(doc) {

                            return ({

                                _id: doc._id,
                                LanguagesTo: doc.LanguagesTo,
                                StartTranslate: doc.StartTranslate,
                                EndTranslate: doc.EndTranslate,
                                IsReadyToTranslate: doc.IsReadyToTranslate,
                                IsDoneTranslate: doc.IsDoneTranslate,
                                Menuid: doc.Menuid,
                                Restaurantid: doc.Restaurantid,
                                TranslationNumber: doc.TranslationNumber,
                                OwnerApproved: doc.OwnerApproved,
                                Complaints: _.where(listComplaint, {
                                    QueueTranslationID: doc._id
                                })
                            });

                        });
                        return res.status(200).json(result);
                    });



                //return res.status(200).json(listQueue);
            });

    });

};


exports.getFile = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var queuedID = new ObjectId(req.body._id);
    var Restaurantid = new ObjectId(req.body.Restaurantid._id);
    var LanguagesTo = req.body.LanguagesTo;

    var user_id = new ObjectId(req.user._id);

    /// Busco Resto
    Restaurant.findOne({
        'userid': user_id,
        '_id': Restaurantid
    }, function(err, restaurants) {
        if (err) {
            return handleError(res, err);
        }
        var nameResto = restaurants.name;
        var searchQueue = {
            _id: queuedID,
            LanguagesTo: LanguagesTo
        };
        QueueTranslate.findOne(searchQueue, {
            MenuDetail: ''
        }, function(err, dataQueueTranslation) {
            if (err) {
                return handleError(res, err);
            }
            var filename = nameResto + '-' + LanguagesTo + '.txt';
            ProcessStringToText(filename, dataQueueTranslation.MenuDetail)
            var pathVirtual = '/assets/download/';
            res.status(200).json({
                _id: queuedID,
                name: filename,
                fullpath: pathVirtual + filename,
                LanguagesTo: LanguagesTo
            });
        })
    });
};

exports.viewTranslation = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var queuedID = new ObjectId(req.query.queuedID);
    var Restaurantid = new ObjectId(req.query.Restaurantid);
    var LanguagesTo = req.query.LanguagesTo;
    var user_id = new ObjectId(req.user._id);


    /// Busco Resto
    Restaurant.findOne({
        'userid': user_id,
        '_id': Restaurantid
    }, function(err, restaurants) {
        if (err) {
            return handleError(res, err);
        }
        var nameResto = restaurants.name;
        var searchQueue = {
            _id: queuedID,
            LanguagesTo: LanguagesTo
        };
        QueueTranslate.findOne(searchQueue, {
            MenuDetail: ''
        }, function(err, dataQueueTranslation) {
            if (err) {
                return handleError(res, err);
            }
            var queryInfo = GetGroupsAndItems(dataQueueTranslation.MenuDetail);
            res.status(200).json(queryInfo);
        })
    });
};


exports.AddComplaint = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var queuedID = new ObjectId(req.query.queuedID);
    var Restaurantid = new ObjectId(req.query.Restaurantid);
    var LanguagesTo = req.query.LanguagesTo;
    var user_id = new ObjectId(req.user._id);

    var DescriptionComplaint = req.query.Complaint;
    var OwnerApproved = req.query.OwnerApproved == false;


    if (!OwnerApproved) {
        res.status(406);
    }
    /// Busco Resto
    Restaurant.findOne({
        'userid': user_id,
        '_id': Restaurantid
    }, function(err, restaurants) {
        if (err) {
            return handleError(res, err);
        }
        var nameResto = restaurants.name;
        var searchQueue = {
            _id: queuedID,
            LanguagesTo: LanguagesTo
        };
        QueueTranslate.findOne(searchQueue, {
            MenuDetail: ''
        }, function(err, dataQueueTranslation) {
            if (err) {
                return handleError(res, err);
            }

            var newcomplateb = {
                QueueTranslationID: queuedID,
                Restaurantid: Restaurantid,
                DescriptionComplaint: DescriptionComplaint,
                Status: 'open'
            };

            Complaint.create(newcomplateb, function(err, complaint) {
                if (err) {
                    res.send(500, err);
                }
                res.status(200).json(complaint);
            });
        });
    });
};


///Aprueba y desaprueba publicacion
exports.ApprovedTranslation = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var queuedID = new ObjectId(req.body._id);
    var Restaurantid = new ObjectId(req.body.Restaurantid._id);
    var OwnerApproved = req.body.OwnerApproved;
    var LanguagesTo = req.body.LanguagesTo;
    var user_id = new ObjectId(req.user._id);

    /// Busco Resto
    Restaurant.findOne({
        'userid': user_id,
        '_id': Restaurantid
    }, function(err, restaurants) {
        if (err) {
            return handleError(res, err);
        }
        var nameResto = restaurants.name;
        var searchQueue = {
            _id: queuedID,
            LanguagesTo: LanguagesTo
        };
        QueueTranslate.findOne(searchQueue, {
            MenuDetail: ''
        }, function(err, dataQueueTranslation) {
            if (err) {
                return handleError(res, err);
            }

            dataQueueTranslation.OwnerApproved = OwnerApproved;
            dataQueueTranslation.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                if (OwnerApproved) {
                    var filename = nameResto + '-' + LanguagesTo + '.txt';
                    ProcessStringToText(filename, dataQueueTranslation.MenuDetail)
                    var pathVirtual = '/assets/download/';
                    res.status(200).json({
                        _id: queuedID,
                        name: filename,
                        fullpath: pathVirtual + filename,
                        LanguagesTo: LanguagesTo
                    });
                } else {
                    res.status(200);
                }
            });
        });
    });
};



function handleError(res, err) {
    return res.send(500, err);
};


function ProcessStringToText(filename, groupAndMenus) {
    var textToFile = createText(groupAndMenus);

    var pathBase = path.normalize(__dirname + '/../../..');
    var pathToDownload = '/client/assets/download/';
    var pathFolderDownloads = path.join(pathBase, pathToDownload, filename);


    var stream = fs.createWriteStream(pathFolderDownloads);
    stream.once('open', function(fd) {
        stream.write(textToFile);
        stream.end();
    });
};

function createText(group) {
    var stringGroupAndMenus = '';
    for (var i = 0; i < group.length; i++) {
        stringGroupAndMenus += (i + 1) + '.-' + group[i].NameGroupInMenu + "\n";
        for (var ii = 0; ii < group[i].ItemsInMenu.length; ii++) {
            var plato = group[i].ItemsInMenu[ii];
            stringGroupAndMenus += plato.NameItemMenu + "\n";
            stringGroupAndMenus += plato.DescriptionItemMenu + "\n";
            stringGroupAndMenus += plato.DescriptionItemsItemMenu + "\n";
            stringGroupAndMenus += plato.PriceItemsItemMenu || '' + "\n";
            stringGroupAndMenus += "\n" + os.EOL;
        };
    }
    return stringGroupAndMenus;
};


function GetGroupsAndItems(group) {
    var groupresponse = {
        namegroup: '',
        Items: []
    };
    var groupsAndItems = [];
    for (var i = 0; i < group.length; i++) {
        groupresponse = {
            namegroup: '',
            Items: []
        };
        groupresponse.namegroup = group[i].NameGroupInMenu;
        for (var ii = 0; ii < group[i].ItemsInMenu.length; ii++) {
            var plato = group[i].ItemsInMenu[ii];
            var menu = {};
            menu.NameMenu = plato.NameItemMenu;
            menu.DescriptionMenu = plato.DescriptionItemMenu;
            menu.ItemsMenu = plato.DescriptionItemsItemMenu;
            menu.PriceMenu = plato.PriceItemsItemMenu;
            groupresponse.Items.push(menu);
        };
        groupsAndItems.push(groupresponse);
    }
    return groupsAndItems;

};