'use strict';

angular.module('leMeNuApp')
  .controller('TranslatorCtrl', function ($scope,$state) {
  	$state.go('translator.list');
  });
