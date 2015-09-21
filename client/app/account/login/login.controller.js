'use strict';

angular.module('leMeNuApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    
    $scope.users = [{email:'uno@uno.com', password:'uno'}, {email:'admin@admin.com', password:'admin'}, {email:'owner@owner.com', password:'owner'}];
    
    $scope.errors = {};
    $scope.info1 = {};
    $scope.info2 = {};

    $scope.login = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/wellcome');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.creo = function(item){
      console.log(item);
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
