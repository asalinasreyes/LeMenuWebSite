'use strict';

angular.module('leMeNuApp')
  .controller('translationCtrl', function ($scope, TranslationOwner) {

  	TranslationOwner.query({}, function(data){
  		$scope.ListTranslation = data;
  	});

  	$scope.download = function(restoInfo){
  		TranslationOwner.getFile();
  	};
  });
