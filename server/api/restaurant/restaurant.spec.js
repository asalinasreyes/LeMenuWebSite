'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

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



describe('GET /api/restaurants', function() {
  UserOwner.authorize();

  it('Lista vacia de restaurantes No Autorizado', function(done) {
    request(app)
      .get('/api/restaurants')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('Lista vacia de restaurantes', function(done) {
    UserOwner
      .get('/api/restaurants')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(0);
        done();
      });
  });


  it('Crea 1 Restaurant', function(done) {
    UserOwner
      .post('/api/restaurants')
      .send(newRestaurant)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('_id');
        restaurantCreated = res.body;
        done();
      });
  });

  it('Crea segundo Restaurant', function(done) {
    UserOwner
      .post('/api/restaurants')
      .send(newRestaurant)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('_id');
        done();
      });
  });


  it('Recupera Lista con 2 restaurantes', function(done) {
    UserOwner
      .get('/api/restaurants')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(2);;
        done();
      });
  });

  it('Busca Restaurant por ID', function(done) {
    UserOwner
      .get('/api/restaurants/' + restaurantCreated._id)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body._id.should.equal(restaurantCreated._id);
        res.body.created_at.should.equal(restaurantCreated.created_at);
        done();
      });
  });


  it('Actualiza Primer restaurante', function(done) {
    var changename = 'change name restaurant';
    restaurantCreated.name = changename;

    UserOwner
      .put('/api/restaurants/' + restaurantCreated._id)
      .send(restaurantCreated)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.name.should.equal(changename);
        done();
      });
  });

  it('Busca Restaurant por ID No Autorizado', function(done) {
    request(app)
      .get('/api/restaurants/' + restaurantCreated._id)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('Actualiza Primer restaurante No Autorizado', function(done) {
    var changename = 'change name restaurant';
    restaurantCreated.name = changename;

    request(app)
      .put('/api/restaurants/' + restaurantCreated._id)
      .send(restaurantCreated)
      .expect(401)
      .end(function(err, res) {
        done();
      });
  });



});