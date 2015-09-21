/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Restaurant = require('../api/restaurant/restaurant.model');
var MenuOfrestaurant = require('../api/menuofrestaurant/menuofrestaurant.model');
var Payment = require('../payment/payment.model');
var QueueProcess = require('../payment/QueueProcess.model');
var translator = require('../api/translatorlanguage/translatorlanguage.model');
var PriceList = require('../payment/price.model');


var uuid = require('node-uuid');


var newRestaurant = {
    name: 'Best Restaurant',
    address: 'street name',
    country: 'CL',
    city: 'santiago',
    language: 'es',
    emailcontact: 'asdfasd@conta.cl',
    Tags: ['chile', 'peruana'],
    urlgoogleMap: 'AnyWhere'
};


var newMenuOfRestaurant = {
    name: 'Verano - vegetariano 2',
    active: true,
    language: ['es', 'en', 'fr'],
    files: []
};

var fileB = {
    public_id: uuid.v1(),
    filename: 'a',
    url: 'https://s-media-cache-ak0.pinimg.com/736x/fe/f0/60/fef06047818eaec0550325010de74a09.jpg'
};

var fileA = {
    public_id: uuid.v1(),
    filename: 'a',
    url: 'https://s-media-cache-ak0.pinimg.com/236x/0b/61/f3/0b61f3c7defc56272c8eb0f1bdc6f937.jpg'
};


newMenuOfRestaurant.files.push(fileA);
newMenuOfRestaurant.files.push(fileB);

User.find({}).remove(function() {
    console.log('Borro todos los usuarios');
});

Restaurant.find({}).remove(function() {
    console.log('Borro todos los Restaurantes');
});

MenuOfrestaurant.find({}).remove(function() {
    console.log('Borro todos los Menus');
});

Payment.find({}).remove(function() {
    console.log('Se borran todos los pagos');
});

translator.find({}).remove(function() {
    console.log('Se borran todos los Traductor');
})

QueueProcess.find({}).remove(function() {
    console.log('Se borran todos los QueueProcess');
});


User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
}, function() {
    console.log('Creo el admin Default');
});

User.create({
    provider: 'local',
    role: 'owner',
    name: 'owner',
    email: 'owner@owner.com',
    password: 'owner'
}, function(err, userinfo) {
    console.log('Creo Owner default');
    newRestaurant.userid = userinfo._id;
    Restaurant.create(newRestaurant, function(err, restaurant) {
        newMenuOfRestaurant.userid = restaurant.userid
        newMenuOfRestaurant.Restaurantid = restaurant._id;
        MenuOfrestaurant.create(newMenuOfRestaurant, function(err, menu) {
            console.log('Creo Menu default en resto default');
            Payment.create({
                order_id: 'String2',
                payment_id: 'String1',
                state: 'succes',
                amount: 11,
                description: 'invento de description',
                userid: userinfo._id,
                Restaurantid: restaurant._id,
                menuid: menu._id,
                created_success: new Date(),
                created_cancel: new Date()
            }, function(err, pago) {
                console.log('informacon de pago', pago);

                QueueProcess.create({
                    'Menuid': menu._id,
                    'LanguagesTo': 'es',
                    'LanguagesFrom': 'es',
                    'Restaurantid': restaurant._id,
                    'IsReadyToTranslate': true,
                    'IsParent': true,
                    'IsDoneTranslate': false

                }, function(err, parentQueue) {

                    QueueProcess.create({
                        'Menuid': menu._id,
                        'LanguagesTo': 'fr',
                        'LanguagesFrom': 'es',
                        'IsReadyToTranslate': false,
                        'Restaurantid': restaurant._id,
                        'IsParent': false,
                        'IsDoneTranslate': false,
                        'Parentid':parentQueue._id
                    }, {
                        'Menuid': menu._id,
                        'LanguagesTo': 'en',
                        'Restaurantid': restaurant._id,
                        'LanguagesFrom': 'es',
                        'IsReadyToTranslate': false,
                        'IsParent': false,
                        'IsDoneTranslate': false,
                        'Parentid':parentQueue._id
                    }, function(err, listquee) {

                    })
                });


            });
        });
    });
});

User.create({
    provider: 'local',
    role: 'translator',
    name: 'translate uno',
    email: 'uno@uno.com',
    password: 'uno'
}, function(err, usernew) {

    translator.create({
        active: true,
        userid: usernew._id,
        languages: ['es', 'en', 'pt', 'fr']
    }, function(err, newtranslator) {
        console.log('Traductor Creado', usernew, newtranslator);
    })
});

User.create({
    provider: 'local',
    role: 'owner',
    name: 'Dueno2',
    email: 'owner2@owner.com',
    password: 'owner2'
}, function(err, data) {
    console.log('Creo Owner default');
    newRestaurant.userid = data._id;
    Restaurant.create(newRestaurant, function(err, data) {
        newMenuOfRestaurant.userid = data.userid
        newMenuOfRestaurant.Restaurantid = data._id;
        MenuOfrestaurant.create(newMenuOfRestaurant, function(err, data) {
            console.log('Creo Menu default en resto default');
        });
    });
});

PriceList.find({}).remove(function() {
    console.log('se borra lista de precio');
});

PriceList.create({
    price: 11,
    typeserviceid: '1',
    typeservicedescription: 'todos',
    validFrom: new Date(),
    validTo: new Date()
}, function(err, data) {

});
