'use strict';

var _ = require('lodash');
var Restaurant = require('../restaurant/restaurant.model');
var QueueTranslate = require('../../payment/QueueProcess.model');

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


        QueueTranslate.find(search, returnFields).populate('Menuid','name').populate('Restaurantid','name').exec(function(err, listQueue) {
            return res.status(200).json(listQueue);
        });

    });

};

exports.getFile = function(req, res) {
    var text={"hello.txt":"Hello World!","bye.txt":"Goodbye Cruel World!"};
    res.set({"Content-Disposition":"attachment; filename=\"req.params.name\""});
    res.send(text[req.params.name]);
}