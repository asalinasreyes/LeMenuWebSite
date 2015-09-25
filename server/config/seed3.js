/**
 * Seed Menus Sin Traduccion
 * Chile Ingles Frances
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
    name: 'Chile seed3' + StringName,
    address: 'street name ' + StringName,
    country: 'CL',
    city: 'santiago',
    language: 'es',
    emailcontact: 'asdfasd@conta.cl',
    Tags: ['chile', 'peruana'],
    urlgoogleMap: 'AnyWhere'
};



var MenuRestaurantChile = {
    name: 'Verano - ' + StringName,
    active: true,
    language: ['en', 'pt'],
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



//---  RestaurantChile con Menu Creado sin Pago

User.create(newUser, function(err, userinfo) {
    console.log('Creo Owner default');
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
                description: 'invento de description',
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
                    IsDoneTranslate: false

                }, function(err, parentQueue) {

                    QueueProcess.create({
                        Menuid: menu._id,
                        LanguagesTo: 'fr',
                        LanguagesFrom: 'es',
                        IsReadyToTranslate: false,
                        Restaurantid: restaurant._id,
                        IsParent: false,
                        IsDoneTranslate: false,
                        Parentid: parentQueue._id
                    }, {
                        Menuid: menu._id,
                        LanguagesTo: 'en',
                        Restaurantid: restaurant._id,
                        LanguagesFrom: 'es',
                        IsReadyToTranslate: false,
                        IsParent: false,
                        IsDoneTranslate: false,
                        Parentid: parentQueue._id
                    }, function(err, listquee) {

                    })
                });
            });
        });
    });
});