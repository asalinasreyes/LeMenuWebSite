/**
 * Seed Menus Pagos y  Traduccion Grupos de Menu Items
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

var StringName = uuid.v1();


var RestaurantChile = {
    name: 'Chile Seed1 ' + StringName,
    address: 'street name ' + StringName,
    country: 'cl',
    city: 'santiago',
    language: 'es',
    emailcontact: 'asdfasd@conta.cl',
    Tags: ['chile', 'peruana'],
    urlgoogleMap: 'AnyWhere'
};



var MenuRestaurantChile = {
    name: 'Verano - ' + StringName,
    active: true,
    language: ['en', 'fr'],
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
                    LanguagesTo: 'es',
                    LanguagesFrom: 'es',
                    Restaurantid: restaurant._id,
                    IsReadyToTranslate: true,
                    IsParent: true,
                    IsDoneTranslate: false,
                    MenuDetail: [{
                        NameGroupInMenu: StringName + " Grupo Chile Entrada",
                        PositionOrder: 0,
                        ItemsInMenu: [{
                            DescriptionItemMenu: "Tomate cebolla",
                            DescriptionItemsItemMenu: "tomate Aceite",
                            PriceItemsItemMenu: "2500",
                            PositionOrder: 0,
                            NameItemMenu: "Chilena"
                        }, {
                            DescriptionItemMenu: "Tomate ",
                            DescriptionItemsItemMenu: "tomate solo",
                            PriceItemsItemMenu: "2500",
                            PositionOrder: 0,
                            NameItemMenu: "Tomate Solo"
                        }]
                    }, {
                        NameGroupInMenu: StringName + " Grupo Chile Plato Fondo",
                        PositionOrder: 0,
                        ItemsInMenu: [{
                            DescriptionItemMenu: "Cazuela",
                            DescriptionItemsItemMenu: "Cazuela a ",
                            PriceItemsItemMenu: "2500",
                            PositionOrder: 0,
                            NameItemMenu: "Cazuela"
                        }, {
                            DescriptionItemMenu: "Humita ",
                            DescriptionItemsItemMenu: "Humieta 2",
                            PriceItemsItemMenu: "2500",
                            PositionOrder: 0,
                            NameItemMenu: "Humita 3"
                        }]
                    }]
                }, function(err, parentQueue) {

                    QueueProcess.create({
                        Menuid: menu._id,
                        LanguagesTo: 'fr',
                        LanguagesFrom: 'es',
                        IsReadyToTranslate: true,
                        Restaurantid: restaurant._id,
                        IsParent: false,
                        IsDoneTranslate: true,
                        Parentid: parentQueue._id,
                        MenuDetail: [{
                            NameGroupInMenu: "entrée salade ",
                            PositionOrder: 0,
                            ItemsInMenu: [{
                                DescriptionItemMenu: "Ensalada Frances",
                                DescriptionItemsItemMenu: "Tomates, oignons, piment, coriandre",
                                PriceItemsItemMenu: "250",
                                PositionOrder: 0,
                                NameItemMenu: "salade chilienne"
                            }, {
                                DescriptionItemMenu: "Salada du Tomate",
                                DescriptionItemsItemMenu: "Tomates",
                                PriceItemsItemMenu: "2500",
                                PositionOrder: 0,
                                NameItemMenu: "Salada du Tomate"
                            }]
                        }, {
                            NameGroupInMenu: "Platee du fonde ",
                            PositionOrder: 0,
                            ItemsInMenu: [{
                                DescriptionItemMenu: "Cazuela Frances",
                                DescriptionItemsItemMenu: "Cazuela Tomates, oignons, piment, coriandre",
                                PriceItemsItemMenu: "250",
                                PositionOrder: 0,
                                NameItemMenu: "Cazuela  chilienne"
                            }, {
                                DescriptionItemMenu: "Humita Frances",
                                DescriptionItemsItemMenu: "Humita Frances Tomates",
                                PriceItemsItemMenu: "2500",
                                PositionOrder: 0,
                                NameItemMenu: "Humita Frances"
                            }]
                        }]
                    }, {
                        Menuid: menu._id,
                        LanguagesTo: 'en',
                        Restaurantid: restaurant._id,
                        LanguagesFrom: 'es',
                        IsReadyToTranslate: true,
                        IsParent: false,
                        IsDoneTranslate: true,
                        Parentid: parentQueue._id,
                        MenuDetail: [{
                            NameGroupInMenu: "Entree Salad",
                            PositionOrder: 0,
                            ItemsInMenu: [{
                                DescriptionItemMenu: "Tomates, oignons, piment, coriandre",
                                DescriptionItemsItemMenu: "Tomates, oignons, piment, coriandre",
                                PriceItemsItemMenu: "1",
                                PositionOrder: 0,
                                NameItemMenu: "Tomates, oignons, piment, coriandre"
                            }, {
                                DescriptionItemMenu: "Tomates, oignons, piment, coriandre",
                                DescriptionItemsItemMenu: "Tomates, oignons, piment, coriandre",
                                PriceItemsItemMenu: "1",
                                PositionOrder: 0,
                                NameItemMenu: "Tomates, oignons, piment, coriandre"
                            }]
                        }, {
                            NameGroupInMenu: "Principal",
                            PositionOrder: 0,
                            ItemsInMenu: [{
                                DescriptionItemMenu: "Cazuela Ingles",
                                DescriptionItemsItemMenu: " Cazuela Ingles  ",
                                PriceItemsItemMenu: "100",
                                PositionOrder: 0,
                                NameItemMenu: "Cazuela Ingles "
                            }, {
                                DescriptionItemMenu: "Humita ingles",
                                DescriptionItemsItemMenu: "Humita ingles",
                                PriceItemsItemMenu: "100",
                                PositionOrder: 0,
                                NameItemMenu: "ingles"
                            }]
                        }]
                    }, function(err, listquee) {})
                });
            });
        });
    })
});