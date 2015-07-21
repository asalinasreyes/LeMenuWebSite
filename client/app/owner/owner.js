'use strict';

angular.module('leMeNuApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('owner', {
        url: '/owner',
        templateUrl: 'app/owner/owner.html',
        controller: 'OwnerCtrl'
      });
  });