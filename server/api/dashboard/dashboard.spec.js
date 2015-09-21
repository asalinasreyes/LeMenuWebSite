'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var UserAdmin = require('../../auth/authed-agent')('admin');

var PathToService= '/api/dashboardinfo';

describe('GET /api/dashboardinfo', function() {
  UserAdmin.authorize();

  it('Busca informacion de dashboard', function(done) {
    UserAdmin
      .get(PathToService)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.equal('0');
        done();
      });
  });

});