'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerNewCtrl', function($scope, $state, Restaurant) {
        $scope.restaurante = {};
        $scope.SaveNewRestaurant = function() {
            Restaurant.save($scope.restaurante, function(info) {
            	$scope.restaurante = {};
            	$state.go('owner.myrestaurant', {}, {reload: true});
            });
        };

        $scope.back= function(){
        	$state.go('owner.myrestaurant', {}, {reload: true});
        };

    });
