'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var Restaurant = require('../restaurant/restaurant.model');
var MenuRestaurant = require('../menuofrestaurant/menuofrestaurant.model');
var QueueProcess = require('../../payment/QueueProcess.model');



Restaurant.find({}).remove(function() {
});

MenuRestaurant.find({}).remove(function() {
});

QueueProcess.find({}).remove(function() {

});



var UserOwner = require('../../auth/authed-agent')('owner');

var newRestaurant = {
  name: '000111',
  address: '000111',
  country: '000111',
  city: '000111',
  language: 'SP',
  Tags: ['chile', 'peruana'],
  urlgoogleMap: 'AnyWhere'
};


var newMenuOfRestaurant = {
  name: '000111 Verano - vegetariano',
  active: true,
  language: ['es', 'en', 'fr']
};

var restaurantCreated = {};


var pathToServices = '/api/translationsowner';

describe('GET /api/Translations Owner', function() {
  UserOwner.authorize();


  it('Crea 1 Restaurant Restaurante', function(done) {
    createResto(UserOwner);
    done();
  });

  it('Recupera Lista de Traducciones del Owner (1)', function(done) {
    UserOwner
      .get(pathToServices)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        done();
      });
  });


  it('Crea 2 Restaurant Restaurante', function(done) {
    createResto(UserOwner);
    done();
  });


  it('Recupera Lista de Traducciones del Owner (2)', function(done) {
    UserOwner
      .get(pathToServices)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(2);
        done();
      });
  });



  it('Busca Lista Sin Autorizado', function(done) {
    request(app)
      .get(pathToServices)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  function createResto(dataForm){
    dataForm
      .post('/api/restaurants')
      .send(newRestaurant)
      .expect(201, function(err, res) {
        if (err) return done(err);
        QueueProcess.create({
          Restaurantid: res.body._id,
          LanguagesTo: 'OnlyTest',
          IsParent: false
        }, function(err, data) {
        });
      });
  };

});