'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerNewCtrl', function($scope, $state, Restaurant, mySharedService ) {
        $scope.restaurante = {};
        $scope.SaveNewRestaurant = function() {
            Restaurant.save($scope.restaurante, function(info) {
            	$scope.restaurante = {};
                mySharedService.prepForBroadcast(info);
            	$state.go('owner.mymenu', {}, {reload: true});
            });
        };

        $scope.back= function(){
        	$state.go('owner.myrestaurant', {}, {reload: true});
        };

    });
