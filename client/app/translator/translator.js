'use strict';

angular.module('leMeNuApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('translator', {
        url: '/translate',
        templateUrl: 'app/translator/translator.html',
        controller: 'TranslatorCtrl'
      })
      .state('translator.list', {
        url: '/list',
        templateUrl: 'app/translator/list/listpending.html',
      });
  });