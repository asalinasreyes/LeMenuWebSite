/**
 * Menus Upload Sin Pagos No  Grupos
 * Chile Ingles Frances
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


var RestaurantChile = {
    name: 'Best Restaurant Chile',
    address: 'street name',
    country: 'CL',
    city: 'santiago',
    language: 'es',
    emailcontact: 'asdfasd@conta.cl',
    Tags: ['chile', 'peruana'],
    urlgoogleMap: 'AnyWhere'
};


var MenuRestaurantChile = {
    name: 'Verano - vegetariano 2',
    active: true,
    language: ['en', 'fr'],
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


MenuRestaurantChile.files.push(fileA);
MenuRestaurantChile.files.push(fileB);


User.create({
    provider: 'local',
    role: 'owner',
    name: 'Dueno2',
    email: 'owner@owner.com',
    password: 'owner'
}, function(err, data) {
    console.log('Creo Owner default');
    RestaurantChile.userid = data._id;
    Restaurant.create(RestaurantChile, function(err, data) {
        MenuRestaurantChile.userid = data.userid
        MenuRestaurantChile.Restaurantid = data._id;
        MenuOfrestaurant.create(MenuRestaurantChile, function(err, data) {
            console.log('Creo Menu default en resto default');
        });
    });
});
