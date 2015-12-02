'use strict';

angular.module('leMeNuApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('translator', {
        url: '/translator',
        templateUrl: 'app/translator/translator.html',
        controller: 'TranslatorCtrl'
      })
      .state('translator.list', {
        url: '/list',
        templateUrl: 'app/translator/list/listpending.html',
        controller: 'QueueListCtrl'
      })
      .state('translator.edit', {
        url: '/edit',
        templateUrl: 'app/translator/edittranslation/edittranslation.html',
        controller: 'TranslatorEditCtrl'
      })
      .state('translator.edit.item', {
        url: '/editmenu/:index/:RowEditing',
        templateUrl: 'app/translator/edittranslation/edititemmenu.html',
        controller: 'TranslatorEditItemMenuCtrl'
      })
      .state('translator.mytranslation', {
        url: '/mytranslation',
        templateUrl: 'app/translator/mytranslations/mytranslations.html',
        controller: 'TranslatorMyListTranslationsCtrl'
      })

    ;
  });