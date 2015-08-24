'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerCtrl', function($scope, $state) {

       $scope.goNew = function(){
       		$state.go('owner.resto.list');
       };
    });
