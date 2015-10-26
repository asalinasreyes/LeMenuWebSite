'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var UserAdmin = require('../../auth/authed-agent')('admin');
var UserOwner = require('../../auth/authed-agent')('owner');
var PathToService = '/api/dashboardinfo';


describe('GET /api/Dashboardinfo', function() {
  UserAdmin.authorize();

  it('Busca informacion de dashboard No Autorizado', function(done) {
    request(app)
      .get(PathToService)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('Busca informacion de dashboard No Autorizado, Rol Owner', function(done) {
    UserOwner
      .get(PathToService)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('Busca informacion de dashboard Autorizado', function(done) {
    UserAdmin
      .get(PathToService)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('qtyRestaurant');
        res.body.should.have.property('qtyPayed');
        res.body.should.have.property('qtyTranslationPayed');
        res.body.should.have.property('TotalPay');
        done();
      });
  });
});
