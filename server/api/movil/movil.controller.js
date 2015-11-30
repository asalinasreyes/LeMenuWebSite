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
        OwnerApproved: true,
        LanguagesTo: ''
    };

    var fieldReturn = {
        Restaurantid: '',
        Menuid: '',
        LanguagesTo: ''
    };

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
                return QueueSchemaProcess.find({
                        IsDoneTranslate: true,
                        IsParent: false,
                        OwnerApproved: true
                    }, {
                        'Restaurantid': '',
                        '_id': 0
                    })
                    .populate('Restaurantid', 'country')
                    .exec(function(err, countriesList) {
                        var listCountriesDuplicate = countriesList.map(function(doc) {
                            return ({
                                _id: doc.Restaurantid.country
                            });
                        });
                        return callback(err, _.uniq(listCountriesDuplicate, '_id'));
                    });
            },
            CitiesAndCountries: function(callback) {
                return QueueSchemaProcess.find({
                        IsDoneTranslate: true,
                        IsParent: false,
                        OwnerApproved: true
                    }, {
                        'Restaurantid': '',
                        '_id': 0
                    })
                    .populate('Restaurantid', 'country city')
                    .exec(function(err, countriesList) {
                        var listCountriesDuplicate = countriesList.map(function(doc) {

                            return ({
                                country: doc.Restaurantid.country,
                                city: doc.Restaurantid.city,
                                id: doc.Restaurantid.country + doc.Restaurantid.city
                            });
                        });

                        return callback(err, _.uniq(listCountriesDuplicate, 'id'));
                    });
            },
            Restaurants: function(callback) {
                return QueueSchemaProcess.find(filterSearch, fieldReturn)
                    .populate('Restaurantid', 'name city country _id  address language emailcontact urlsite urlgoogleMap')
                    .populate('Menuid', 'language')
                    .exec(function(err, result) {

                        var listLanguage = [];

                        result.map(function(doc) {
                            if (!listLanguage[doc.Menuid._id]) {
                                listLanguage[doc.Menuid._id] = [];
                            }
                            var lenArray = listLanguage[doc.Menuid._id].length;
                            listLanguage[doc.Menuid._id][lenArray] = doc.LanguagesTo

                        });

                        console.log('listado de idiomas', listLanguage);

                        var mylist = result.map(function(doc) {
                            return ({
                                name: doc.Restaurantid.name,
                                country: doc.Restaurantid.country,
                                city: doc.Restaurantid.city,
                                _id: doc.Restaurantid._id,
                                address: doc.Restaurantid.address,
                                emailcontact: doc.Restaurantid.emailcontact,
                                urlsite: doc.Restaurantid.urlsite,
                                urlgoogleMap: doc.Restaurantid.urlgoogleMap,
                                BaseLeng: doc.Restaurantid.language,
                                language:listLanguage[doc.Menuid._id]

                            });
                        });
                        
                        return callback(err, _.uniq(mylist, '_id'));

                        /*
                        if (filterCountry) {
                            return callback(err, _.where(_.uniq(mylist, '_id'), {
                                country: filterCountry
                            }));
                        } else {
                            return callback(err, _.uniq(mylist, '_id'));
                        }
                        */
                    });
            },
            Menus: function(callback) {
                return QueueSchemaProcess.find(filterSearch, 'MenuDetail Restaurantid Menuid LanguagesTo')
                    .populate('MenuDetail')
                    .populate('MenuDetail.ItemsInMenu')
                    .exec(function(err, result) {
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
                                                Name: doc.NameItemMenu
                                            })
                                        })
                                    })
                                })
                            });
                        });
                        return callback(err, mylist);
                    });
            },
            ParentsMenu: function(callback) {
                var listParents = [];
                return QueueSchemaProcess.find({
                        IsParent: true
                    }, 'MenuDetail Restaurantid LanguagesTo LanguagesFrom')
                    .populate('MenuDetail')
                    .populate('MenuDetail.ItemsInMenu')
                    .exec(function(err, result) {
                        result.map(function(doc) {
                            var restaurantid = doc.Restaurantid;
                            var language = doc.LanguagesFrom;
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
                                            listParents.push({
                                                _id: doc._id,
                                                Description: doc.DescriptionItemMenu,
                                                Restaurantid: restaurantid,
                                                Price: doc.PriceItemsItemMenu,
                                                LanguagesFrom: language,
                                                Name: doc.NameItemMenu
                                            })
                                        })
                                    })
                                })
                            });
                        });
                        return callback(err, listParents);
                    });
            }
        },
        function(err, restaurantsInfo) {
            if (err) {
                return res.json(200, err);
            };
            return res.json(200, restaurantsInfo);
        });

};


function handleError(res, err) {
    return res.send(500, err);
}
