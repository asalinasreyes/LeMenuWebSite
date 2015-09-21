'use strict';

angular.module('leMeNuApp')
  .controller('OwnerCtrl', function ($scope,$state,Mylocation) {
  	$state.go('owner.resto');
  	
  });
