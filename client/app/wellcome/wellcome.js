'use strict';

angular.module('leMeNuApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('wellcome', {
        url: '/wellcome',
        templateUrl: 'app/wellcome/wellcome.html',
        controller: 'WellcomeCtrl'
      });
  });