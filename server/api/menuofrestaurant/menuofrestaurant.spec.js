'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var Restaurant = require('../restaurant/restaurant.model');
var MenuRestaurant = require('../menuofrestaurant/menuofrestaurant.model');


var UserOwner = require('../../auth/authed-agent')('owner');

var restaurantCreated = null;

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
  name: 'Verano - vegetariano',
  active: true,
  language: ['es', 'en', 'fr']
};


describe('GET /API/Restaurants/MenuOfRestaurant', function() {

  ///Limpia tablas de Restaurantes y Menus
  before(function(done) {
    Restaurant.remove().exec().then(function() {
      done();
    });
    MenuRestaurant.remove().exec().then(function() {
      done();
    });
  });

  UserOwner.authorize();

  it('Lista vacia de restaurantes/menuofrestaurant No Autorizado', function(done) {
    request(app)
      .get('/api/restaurants/menuofrestaurant')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });


  it('Lista vacia de restaurantes', function(done) {
    UserOwner
      .get('/api/restaurants/menuofrestaurant')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(0);
        done();
      });
  });

  it('Crea 1 Restaurant Restaurante', function(done) {
    UserOwner
      .post('/api/restaurants')
      .send(newRestaurant)
      .expect(201, function(err, res) {
        if (err) return done(err);
        restaurantCreated = res.body;
        res.body.should.have.property('_id');
        done();

      });
  });


  it('Crea 1 Menu Asociada al Restaurante Creado', function(done) {

    newMenuOfRestaurant.restaurantid = restaurantCreated._id;
    newMenuOfRestaurant.userid = restaurantCreated.userid;
    UserOwner
      .post('/api/restaurants/menuofrestaurant')
      .send(newMenuOfRestaurant)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('_id');
        done();
      });
  });


  it('Crea 2 Menu Asociada al Restaurante Creado', function(done) {
    newMenuOfRestaurant.name = 'Segundo menu';
    newMenuOfRestaurant.restaurantid = restaurantCreated._id;
    newMenuOfRestaurant.userid = restaurantCreated.userid;
    UserOwner
      .post('/api/restaurants/menuofrestaurant')
      .send(newMenuOfRestaurant)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('_id');
        res.body.name.should.be.equal(newMenuOfRestaurant.name);        
        done();
      });
  })

  it('Lista con 2 Menu Asociada', function(done) {
    UserOwner
      .get('/api/restaurants/menuofrestaurant')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(2);
        done();
      });
  })


});