/**
 * Seed Menus Pagos Grupos de Menu Items
 * Chile 
 * Traduccion Ingles Frances
 */

'use strict';

var User = require('../api/user/user.model');
var Restaurant = require('../api/restaurant/restaurant.model');
var MenuOfrestaurant = require('../api/menuofrestaurant/menuofrestaurant.model');
var Payment = require('../payment/payment.model');
var QueueProcess = require('../payment/QueueProcess.model');


var uuid = require('node-uuid');



exports.index = function(languages) {
    var StringName = uuid.v1();

    var RestaurantChile = {
        name: 'Brasil Seed5 ' + StringName,
        address: 'Rua  ' + StringName,
        country: 'br',
        city: 'Sao Paulo',
        language: 'pt',
        emailcontact: 'asdfasd@conta.com.br',
        Tags: ['churrasco'],
        urlgoogleMap: 'AnyWhere'
    };

    if (!languages) {
        languages= ['en', 'fr'];
    };

    var MenuRestaurantChile = {
        name: 'Verano - ' + StringName,
        active: true,
        language: languages,
        files: []
    };

    var fileB = {
        public_id: StringName,
        filename: 'a',
        url: 'https://s-media-cache-ak0.pinimg.com/736x/fe/f0/60/fef06047818eaec0550325010de74a09.jpg'
    };

    var fileA = {
        public_id: uuid.v1(),
        filename: 'a',
        url: 'https://s-media-cache-ak0.pinimg.com/236x/0b/61/f3/0b61f3c7defc56272c8eb0f1bdc6f937.jpg'
    };


    MenuRestaurantChile.files.push(fileA);
    MenuRestaurantChile.files.push(fileB);


    var newUser = {
        provider: 'local',
        role: 'owner',
        name: StringName,
        email: StringName + '@owner2.com',
        password: StringName
    };
    User.create(newUser, function(err, userinfo) {
        RestaurantChile.userid = userinfo._id;
        Restaurant.create(RestaurantChile, function(err, restaurant) {
            MenuRestaurantChile.userid = restaurant.userid
            MenuRestaurantChile.Restaurantid = restaurant._id;
            MenuOfrestaurant.create(MenuRestaurantChile, function(err, menu) {
                Payment.create({
                    order_id: 'String2',
                    payment_id: 'String1',
                    state: 'success',
                    amount: 11,
                    description: 'Pago ' + StringName,
                    userid: userinfo._id,
                    Restaurantid: restaurant._id,
                    menuid: menu._id,
                    created_success: new Date(),
                    created_cancel: new Date()
                }, function(err, pago) {
                    QueueProcess.create({
                        Menuid: menu._id,
                        LanguagesTo: 'pt',
                        LanguagesFrom: 'pt',
                        Restaurantid: restaurant._id,
                        IsReadyToTranslate: true,
                        IsParent: true,
                        IsDoneTranslate: false,
                        MenuDetail: [{
                            NameGroupInMenu: StringName + " Grupo Chile Entrada",
                            PositionOrder: 0,
                            ItemsInMenu: [{
                                DescriptionItemMenu: "sdf",
                                DescriptionItemsItemMenu: "dsf",
                                PriceItemsItemMenu: "er",
                                PositionOrder: 0,
                                NameItemMenu: "afasd"
                            }]
                        }]
                    }, function(err, parentQueue) {

                        QueueProcess.create({
                            Menuid: menu._id,
                            LanguagesTo: languages[0],
                            LanguagesFrom: 'pt',
                            IsReadyToTranslate: true,
                            Restaurantid: restaurant._id,
                            IsParent: false,
                            IsDoneTranslate: true,
                            Parentid: parentQueue._id,
                            MenuDetail: [{
                                NameGroupInMenu: "ensalada "+languages[0],
                                PositionOrder: 0,
                                ItemsInMenu: [{
                                    DescriptionItemMenu: "Ensalada "+ languages[0],
                                    DescriptionItemsItemMenu: "dsf",
                                    PriceItemsItemMenu: "1",
                                    PositionOrder: 0,
                                    NameItemMenu: "afasd"
                                }]
                            }]
                        }, {
                            Menuid: menu._id,
                            LanguagesTo: languages[1],
                            Restaurantid: restaurant._id,
                            LanguagesFrom: 'pt',
                            IsReadyToTranslate: true,
                            IsParent: false,
                            IsDoneTranslate: true,
                            Parentid: parentQueue._id,
                            MenuDetail: [{
                                NameGroupInMenu: "ensaladas "+languages[1],
                                PositionOrder: 0,
                                ItemsInMenu: [{
                                    DescriptionItemMenu: "una ensalda en "+ languages[1],
                                    DescriptionItemsItemMenu: "dsf",
                                    PriceItemsItemMenu: "1",
                                    PositionOrder: 0,
                                    NameItemMenu: "afasd"
                                }]
                            }]
                        }, function(err, listquee) {})
                    });
                });
            });
        })
    });
};