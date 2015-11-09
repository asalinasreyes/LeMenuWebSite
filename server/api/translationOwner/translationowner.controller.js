'use strict';

var _ = require('lodash');
var Restaurant = require('../restaurant/restaurant.model');
var QueueTranslate = require('../../payment/QueueProcess.model');



var http = require('http');
var fs = require('fs');
var path = require('path');

// Get list of Restaurants
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
            Restaurantid: ''
        };

        QueueTranslate.find(search, returnFields)
            .populate('Menuid', 'name')
            .populate('Restaurantid', 'name')
            .exec(function(err, listQueue) {
                return res.status(200).json(listQueue);
            });

    });

};


exports.getFile = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var queuedID = new ObjectId(req.body.restoInfo._id);
    var Restaurantid = new ObjectId(req.body.restoInfo.Restaurantid._id);
    var LanguagesTo = req.body.restoInfo.LanguagesTo;

    var user_id = new ObjectId(req.user._id);

    console.log('queuedID: ', req.body.restoInfo._id);
    console.log('Restaurantid: ', req.body.restoInfo.Restaurantid._id);
    console.log('LanguagesTo: ', req.body.restoInfo.LanguagesTo);


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
                name: filename,
                fullpath: pathVirtual + filename
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

        console.log('queuedID: ', req.query.queuedID);
    console.log('Restaurantid: ', req.query.Restaurantid);
    console.log('LanguagesTo: ', req.query.LanguagesTo);


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
            console.log('resultado de la busqueda queryInfo', queryInfo);
            res.status(200).json(queryInfo);
        })
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
            stringGroupAndMenus += plato.NameItemMenu + "\n ";
            stringGroupAndMenus += plato.DescriptionItemMenu + "\n";
            stringGroupAndMenus += plato.DescriptionItemsItemMenu + "\n";
            stringGroupAndMenus += plato.PriceItemsItemMenu || '' + "\n";
            stringGroupAndMenus += "\n";
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
    console.log(groupsAndItems);
    return groupsAndItems;

};