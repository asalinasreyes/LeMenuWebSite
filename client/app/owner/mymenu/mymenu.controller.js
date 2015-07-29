'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerMenuCtrl', function($scope, $state) {
       $scope.goNew = function(){
       		$state.go('owner.mymenu.new');
       };
    });
