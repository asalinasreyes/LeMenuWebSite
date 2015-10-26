'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var UserAdmin = require('../../auth/authed-agent')('admin');

var PathToService = '/api/dashboardinfo';

describe('GET /api/dashboardinfo', function() {
  UserAdmin.authorize();
  var expectValues = {
    qtyRestaurant: 0,
    qtyPayed: 0,
    qtyTranslationPayed: 0,
    TotalPay: 0
  };

  it('Busca informacion de dashboard', function(done) {
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