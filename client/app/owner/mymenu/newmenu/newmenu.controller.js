'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerNewMenuCtrl', function($scope, $state, RestaurantMenu) {
        $scope.restaurantemenu = {};
        $scope.SaveNewRestaurantMenu = function() {
            RestaurantMenu.save($scope.restaurantemenu, function(info) {
            	$scope.restaurantemenu = {};
            	$state.go('owner.mymenu.listmenu', {}, {reload: true});
            });
        };

        $scope.back= function(){
        	$state.go('owner.mymenu.listmenu', {}, {reload: true});
        };

    });
