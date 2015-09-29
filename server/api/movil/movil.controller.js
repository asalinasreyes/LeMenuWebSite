'use strict';

var async = require('async');
var _ = require('lodash');
var RestaurantSchema = require('../restaurant/restaurant.model');
var QueueSchemaProcess = require('../../payment/QueueProcess.model');


exports.index = function(req, res) {

    var restaurantsInfo;
    restaurantsInfo = {};

    var filterSearch = {
        IsDoneTranslate: true,
        IsParent: false,
        LanguagesTo: ''
    }
    var fieldReturn = {
        Restaurantid: '',
        Menuid: ''
    }

    if (req.query && req.query.language && req.query.language.toLowerCase() != 'all') {
        filterSearch.LanguagesTo = req.query.language;
    } else {
        delete filterSearch.LanguagesTo;
    }

    var filterCountry = null;
    if (req.query && req.query.country && req.query.country != '') {
        filterCountry = req.query.country;
    }
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
            CitiesAndCountries: function(callback) {
                return RestaurantSchema.aggregate([{
                    $group: {
                        _id: {country:"$country", city: "$city"}
                    }
                }], function(err, result) {
                    return callback(err, result);
                });
            },
            Restaurants: function(callback) {
                console.log('filterSearch', filterSearch);
                return QueueSchemaProcess.find(filterSearch, fieldReturn)
                    .populate('Restaurantid', 'name city country _id latitude longitude address')
                    .populate('Menuid', 'language')
                    .exec(function(err, result) {
                        var mylist = result.map(function(doc) {
                            return ({
                                name: doc.Restaurantid.name,
                                country: doc.Restaurantid.country,
                                city: doc.Restaurantid.city,
                                _id: doc.Restaurantid._id,
                                address: doc.Restaurantid.address,
                                language: doc.Menuid.language,
                                latitude: doc.Restaurantid.latitude,
                                longitude: doc.Restaurantid.longitude
                            });
                        });
                        if (filterCountry) {
                            return callback(err, _.where(_.uniq(mylist, '_id'), {
                                country: filterCountry
                            }));
                        } else {
                            return callback(err, _.uniq(mylist, '_id'));
                        }
                    });
            },
            Menus: function(callback) {
                return QueueSchemaProcess.find(filterSearch, 'MenuDetail Restaurantid Menuid LanguagesTo')
                    .populate('MenuDetail')
                    .populate('MenuDetail.ItemsInMenu')
                    .exec(function(err, result) {
                        console.log('-----------------------');
                        console.log(result);
                        var mylist = result.map(function(doc) {
                            return ({
                                _id: doc._id,
                                Restaurantid: doc.Restaurantid,
                                LanguagesTo: doc.LanguagesTo,
                                Groups: doc.MenuDetail.map(function(doc) {
                                    return ({
                                        _id: doc._id,
                                        Name: doc.NameGroupInMenu,
                                        order: doc.PositionOrder,
                                        plato: doc.ItemsInMenu.map(function(doc) {
                                            return ({
                                                _id: doc._id,
                                               Description: doc.DescriptionItemMenu,
                                               DescriptionItems: doc.DescriptionItemsItemMenu,
                                               Price: doc.PriceItemsItemMenu,
                                               Order: doc.PositionOrder,
                                               Name:doc.NameItemMenu
                                            })
                                        })
                                    })
                                })
                            });
                        });
                        return callback(err, mylist);
                    });
            }
        },
        function(err, restaurantsInfo) {
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