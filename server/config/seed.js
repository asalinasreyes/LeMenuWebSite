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



User.find({}).remove(function() {
    //console.log('Borro todos los usuarios');
});

Restaurant.find({}).remove(function() {
    //console.log('Borro todos los Restaurantes');
});

MenuOfrestaurant.find({}).remove(function() {
    //console.log('Borro todos los Menus');
});

Payment.find({}).remove(function() {
    //console.log('Se borran todos los pagos');
});

translator.find({}).remove(function() {
    //console.log('Se borran todos los Traductor');
})

QueueProcess.find({}).remove(function() {
    //console.log('Se borran todos los QueueProcess');
});


PriceList.find({}).remove(function() {
    //console.log('se borra lista de precio');
});

PriceList.create({
    price: 11,
    typeserviceid: '1',
    typeservicedescription: 'todos',
    validFrom: new Date(),
    validTo: new Date()
}, function(err, data) {

});


if (false) {
    //console.log('*************************************************************')
    // Chile Traduccion Ingles Frances
    require('./seed1');
    //console.log('*************************************************************')


    /* 
    Brasil Traduccion Ingles Frances
    */
    var Brasil = require('./seed5');
    Brasil.index();
    Brasil.index();
    Brasil.index(["es", "fr"]);

    //* Chile Traduccion Ingles Portugues
    require('./seed2');
    //* Chile Ingles Frances Sin Traduccion
    require('./seed3');
    //Menus Upload Sin Pagos No  Grupos
    require('./seed4');
}

//Creacion de usuarios del Sistema
require('./seedUsers');