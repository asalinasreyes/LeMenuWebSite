/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Restaurant = require('../api/restaurant/restaurant.model');
var MenuOfrestaurant = require('../api/menuofrestaurant/menuofrestaurant.model');
var Payment = require('../payment/payment.model');

var PriceList = require('../payment/price.model');


var uuid = require('node-uuid');


var newRestaurant = {
  name: 'Best Restaurant',
  address: 'street name',
  country: 'chile',
  city: 'santiago',
  language: 'SP',
  Tags: ['chile', 'peruana'],
  urlgoogleMap: 'AnyWhere'
};


var newMenuOfRestaurant = {
  name: 'Verano - vegetariano 2',
  active: true,
  language: ['es', 'en', 'fr'],
  files: []
};

var file = {
  public_id: uuid.v1(),
  filename: uuid.v1(),
  url: uuid.v1()
}

newMenuOfRestaurant.files.push(file);
newMenuOfRestaurant.files.push(file);

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
}, function(err, data) {
  console.log('Creo Owner default');
  newRestaurant.userid = data._id;
  Restaurant.create(newRestaurant, function(err, data) {
    newMenuOfRestaurant.userid = data.userid
    newMenuOfRestaurant.restaurantid = data._id;
    MenuOfrestaurant.create(newMenuOfRestaurant, function(err, data) {
      console.log('Creo Menu default en resto default');
    });
  });

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
    newMenuOfRestaurant.restaurantid = data._id;
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