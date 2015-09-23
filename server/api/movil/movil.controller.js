'use strict';

var async = require('async');
var _ = require('lodash');
var RestaurantSchema = require('../restaurant/restaurant.model');
var QueueSchemaProcess = require('../../payment/QueueProcess.model');


exports.index = function(req, res) {

    var restaurantsInfo;
    restaurantsInfo = {};

    async.parallel({
        Countries: function(callback) {
            return RestaurantSchema.aggregate([{
                $group: {
                    _id: "$country"
                }
            }], function(err, result) {
                return callback(err, result);
            });
        },
        Restaurants: function(callback) {
            console.log('Body en listar ', req.query );
            if (req.query && req.query.language) {
                if (req.query.language.toLowerCase()=="all") {
                    return QueueSchemaProcess.find({IsDoneTranslate:true,IsParent:false},{Restaurantid:'', MenuDetail:'', LanguagesTo:''}).populate('Restaurantid','name city _id country').exec( function(err, result) {return callback(err, result);});    
                }else{
                return QueueSchemaProcess.find({IsDoneTranslate:true,IsParent:false,LanguagesTo:req.query.language},{Restaurantid:'', MenuDetail:'', LanguagesTo:''}).populate('Restaurantid','name city _id country').exec( function(err, result) {return callback(err, result);});    
                }
            }else{
                return QueueSchemaProcess.find({IsDoneTranslate:true,IsParent:false},{Restaurantid:''}).populate('Restaurantid','name city _id country').exec( function(err, result) {return callback(err, result);});    
            }
            
        }
    }, function(err, restaurantsInfo) {
        if (err) {
            return res.json(200, err);    
        };
        console.log('resultado ', restaurantsInfo);
        return res.json(200, restaurantsInfo);
    });

};


function handleError(res, err) {
    return res.send(500, err);
}