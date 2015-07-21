'use strict';

angular.module('leMeNuApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('translator', {
        url: '/translator',
        templateUrl: 'app/translator/translator.html',
        controller: 'TranslatorCtrl'
      });
  });