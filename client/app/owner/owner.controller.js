'use strict';

angular.module('leMeNuApp')
  .controller('OwnerCtrl', function ($scope,$state,Restaurant) {
  	Restaurant.query({},function(listrestaurants){

  	});
  });
