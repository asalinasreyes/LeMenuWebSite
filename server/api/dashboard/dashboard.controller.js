'use strict';

var _ = require('lodash');
var async = require('async');
var QueueSchemaProcess = require('../../payment/QueueProcess.model');
var PaymentSchemaInfo = require('../../payment/payment.model');
var ComplaintSchema = require('../../payment/Complaint.model');

var Restaurant = require('../restaurant/restaurant.model');
var MenuOfrestaurant = require('../menuofrestaurant/menuofrestaurant.model');
var translator = require('../translatorlanguage/translatorlanguage.model');

var usersSchema = require('../user/user.model');

var NUMBER_MAX_ROWS = 5;


exports.index = function(req, res) {
    var dashboardinfo = {};

    async.parallel({
        qtyPayed: function(callback) {
            return QueueSchemaProcess.count({
                IsParent: true
            }, function(err, result) {
                return callback(err, result);
            });
        },
        qtyTranslationPayed: function(callback) {
            return QueueSchemaProcess.count({
                IsParent: false
            }, function(err, result) {
                return callback(err, result);
            });
        },
        qtyRestaurantPayed: function(callback) {
            return QueueSchemaProcess.aggregate([{
                $group: {
                    _id: "$Restaurantid"
                }
            }], function(err, result) {
                return callback(err, result.length);
            });
        },
        TotalPay: function(callback) {
            return PaymentSchemaInfo.aggregate([{
                $group: {
                    _id: '$state',
                    Total: {
                        $sum: '$amount'
                    }
                }
            }], function(err, result) {
                var sumTotalPayed = 0;
                for (var i = 0; i < result.length; i++) {
                    if (result[i]._id == 'success') {
                        sumTotalPayed = result[i].Total;
                    };
                };
                return callback(err, sumTotalPayed);
            });
        },
        qtyRestaurant: function(callback) {
            return Restaurant.count({}, function(err, qtyRestaurant) {
                return callback(err, qtyRestaurant);
            })
        },
        QtyCountries: function(callback) {
            return Restaurant.aggregate([{
                $group: {
                    _id: "$country",
                    count: {
                        $sum: 1
                    }
                }
            }], function(err, result) {
                return callback(err, result);
            });
        },
        qtyMenus: function(callback) {
            return MenuOfrestaurant.count({}, function(err, qtyMenus) {
                return callback(err, qtyMenus);
            })
        },
        qtyRestaurantNotMenu: function(callback) {
            return Restaurant.count({}, function(err, qtyResto) {
                return MenuOfrestaurant.aggregate([{
                    $group: {
                        _id: "$Restaurantid"
                    }
                }], function(err, QtyNumberMenuResto) {
                    return callback(err, qtyResto - QtyNumberMenuResto.length);
                });
            });
        },
        qtyMenuNoPagados: function(callback) {
            return MenuOfrestaurant.count({}, function(err, qtyMenu) {
                return PaymentSchemaInfo.aggregate([{
                    $match: {
                        state: "success"
                    }
                }, {
                    $group: {
                        _id: "$menuid"
                    }

                }], function(err, QtyMenuPayed) {
                    return callback(err, qtyMenu - QtyMenuPayed.length);
                });
            });
        },
        qtyMenuNoPagadosIntentoPago: function(callback) {
            return MenuOfrestaurant.count({}, function(err, qtyMenu) {
                return PaymentSchemaInfo.aggregate([{
                    $group: {
                        _id: "$menuid"
                    }

                }], function(err, QtyMenuPayed) {
                    return callback(err, qtyMenu - QtyMenuPayed.length);
                });
            });
        }

    }, function(err, dashboardinfo) {
        if (err) {
            return res.json(404).json({
                err: err
            });
        }
        return res.status(200).json(dashboardinfo);
    });
};

exports.GetListRestaurants = function(req, res) {

    if (req.query.onlyTop && req.query.onlyTop == 'true') {
        Restaurant.find({}).sort({
            createdat: 'desc'
        }).limit(NUMBER_MAX_ROWS).exec(function(err, listresto) {
            if (err) {
                return res.status(404).json(err);
            }
            return res.status(200).json(listresto);
        });
    } else {
        Restaurant.find({}).populate('userid', 'name email').exec(function(err, listresto) {
            if (err) {
                return res.status(404).json(err);
            }
            return res.status(200).json(listresto);
        });
    }
};


exports.GetListMenus = function(req, res) {

    if (req.body.onlyTop && req.body.onlyTop == 'true') {
        MenuOfrestaurant.find({}).sort({
            createdat: 'desc'
        }).limit(NUMBER_MAX_ROWS).exec(
            function(err, ListMenu) {
                if (err) {
                    return res.status(404).json(err);
                }
                return res.status(200).json(ListMenu);
            });
    } else {
        MenuOfrestaurant.find({}, function(err, ListMenu) {
            if (err) {
                return res.status(404).json(err);
            }
            return res.status(200).json(ListMenu);
        });
    }
};

exports.GetListMenusByIDResto = function(req, res) {


    var ObjectId = require('mongoose').Types.ObjectId;
    var restaurantid = new ObjectId(req.query.idResto);

    Restaurant.find({
        _id: restaurantid
    }, function(err, InfoResto) {

        MenuOfrestaurant.find({
            Restaurantid: restaurantid
        }, function(err, ListMenu) {
            if (err) {
                return res.status(404).json(err);
            }
            QueueSchemaProcess.find({
                Restaurantid: restaurantid,
                IsParent: false
            }, function(err, ListQueue) {
                ComplaintSchema.find({
                    Restaurantid: restaurantid
                }, function(err, ListComplaint) {
                    return res.status(200).json({
                        ListMenu: ListMenu,
                        ListQueue: ListQueue,
                        ListComplaint: ListComplaint,
                        InfoResto:InfoResto
                    });
                });
            })
        });
    });
};


exports.GetListPayments = function(req, res) {
    if (req.body.onlyTop && req.body.onlyTop == 'true') {
        PaymentSchemaInfo.find({}).sort({
            createdat: 'desc'
        }).limit(NUMBER_MAX_ROWS).exec(
            function(err, listPayments) {
                if (err) {
                    return res.status(404).json(err);
                }
                return res.status(200).json(listPayments);
            });
    } else {
        PaymentSchemaInfo.find({}, function(err, listPayments) {
            if (err) {
                return res.status(404).json(err);
            }
            return res.status(200).json(listPayments);
        });
    }
};



exports.GetListComplaint = function(req, res) {
    ComplaintSchema.find({})
        .populate('Restaurantid')
        .populate('QueueTranslationID')
        .exec(function(err, ListComplaint) {
            if (err) {
                return res.status(404).json(err);
            }
            usersSchema.find()
                .exec(function(err, listUser) {
                    var complaint = ListComplaint.map(function(doc) {
                        var users = _.where(listUser, {
                            _id: doc.QueueTranslationID.UserTranslateid
                        });
                        return ({
                            Complaintid: doc._id,
                            Restaurantid:doc.Restaurantid._id,
                            ComplainNumber: doc.ComplainNumber,
                            Createdat: doc.Createdat,
                            RestoCountry: doc.Restaurantid.country,
                            Restocity: doc.Restaurantid.city,
                            Restoname: doc.Restaurantid.name,
                            DescriptionComplaint: doc.DescriptionComplaint,
                            State: doc.Status,
                            LanguagesTo: doc.QueueTranslationID.LanguagesTo,
                            LanguagesFrom: doc.QueueTranslationID.LanguagesFrom,
                            user: users[0].name

                        });
                    });


                    return res.status(200).json(complaint);
                });
        });
};





exports.clearDatabase = function(req, res) {

    async.parallel({
            Restaurant: function(callback) {
                Restaurant.find({}).remove(function() {
                    return callback(true);
                });
            },
            Menu: function(callback) {
                MenuOfrestaurant.find({}).remove(function() {
                    return callback(true);
                });
            },
            Payment: function(callback) {
                PaymentSchemaInfo.find({}).remove(function() {
                    return callback(true);
                });
            },
            Queue: function(callback) {
                QueueSchemaProcess.find({}).remove(function() {
                    return callback(true);
                });
            }
        },
        function(err, clarAll) {
            if (err) {
                return res.json(404, err);
            };
            return res.status(200).json(clarAll);
        });
};


exports.GetListTranslations = function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    Restaurant.find({
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


        QueueSchemaProcess.find({})
            .populate('UserTranslateid','name')
            .populate('Menuid')
            .populate('Restaurantid', 'name country')
            .sort({
                TranslationNumber: -1
            })
            .exec(function(err, listQueue) {

                ComplaintSchema.find({}).exec(function(err, listComplaint) {
                    if (err) {
                        return handleError(res, err);
                    }

                    var result = listQueue.map(function(doc) {

                        return ({

                            _id: doc._id,
                            LanguagesFrom: doc.LanguagesFrom,
                            LanguagesTo: doc.LanguagesTo,
                            StartTranslate: doc.StartTranslate,
                            EndTranslate: doc.EndTranslate,
                            IsReadyToTranslate: doc.IsReadyToTranslate,
                            IsDoneTranslate: doc.IsDoneTranslate,
                            country: doc.Restaurantid.country,
                            Menuid: doc.Menuid,
                            Restaurantid: doc.Restaurantid,
                            TranslationNumber: doc.TranslationNumber,
                            OwnerApproved: doc.OwnerApproved,
                            userid:doc.UserTranslateid,
                            Complaints: _.where(listComplaint, {
                                QueueTranslationID: doc._id
                            })
                        });

                    });
                    return res.status(200).json(result);
                });
            });
    });
};


exports.viewTranslation = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var queuedID = new ObjectId(req.query.queuedID);
    var Restaurantid = new ObjectId(req.query.Restaurantid);
    var LanguagesTo = req.query.LanguagesTo;



    /// Busco Resto
    Restaurant.findOne({
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
        QueueSchemaProcess.findOne(searchQueue, {
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


function handleError(res, err) {
    return res.status(500).json(err);
};
