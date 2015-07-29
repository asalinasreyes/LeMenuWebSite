'use strict';
 
var app = require('../app');
var User = require('../api/user/user.model');
var request = require('supertest');
var q = require('q');
 
// used to generate unique email addresses
var userCounter = 0;
 
function Authed(role) {
  var agent = request.agent(app);
  var deferred = q.defer();
  var token;
 
  var userData = {
    name: 'alan turing',
    email: (userCounter++) +'@test.com',
    password: 'password',
    role: role
  };
 
  function createUser(done) {
    var user = new User(userData);
    user.save(function(err) {
      if (err) return done(err);
      return done();
    });
  }
 
  function deleteUser(done) {
      User.remove({email: userData.email}, function(err) {
        if (err) return done(err);
        done();
      });
    };
 
  function getToken(done) {
    agent
      .post('/auth/local')
      .send(userData)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        token = res.body.token;
        deferred.resolve();
        done();
      });
    return deferred.promise;
  }
 
  return {
    authorize: function() {
      before(function(done) {
        createUser(done);
      });
      before(function(done) {
        getToken(done).then(function() {
          done();
        });
      })
    },
    deleteUser: function(done) {
      return deleteUser(done);
    },
    token: function() {
      return token;
    },
    get: function(url) {
      return agent.get(url).set('authorization', 'Bearer ' + token);
    },
    post: function(url) {
      return agent.post(url).set('authorization', 'Bearer ' + token);
    },
    put: function(url) {
      return agent.put(url).set('authorization', 'Bearer ' + token);
    },
    delete: function(url) {
      return agent.delete(url).set('authorization', 'Bearer ' + token);
    }
  }
}
 
module.exports = function(role) {
  return new Authed(role);
} 