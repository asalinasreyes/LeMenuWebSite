'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerNewMenuCtrl', function($scope, $state, RestaurantMenu, mySharedService) {
        $scope.restaurantemenu = {};
        $scope.SaveNewRestaurantMenu = function() {
            $scope.restaurantemenu.restaurantid =  mySharedService.message._id;
            RestaurantMenu.save($scope.restaurantemenu, function(info) {
            	$scope.restaurantemenu = {};
            	$state.go('owner.mymenu.listmenu', {}, {reload: true});
            });
        };

        $scope.back= function(){
        	$state.go('owner.mymenu.listmenu', {}, {reload: true});
        };

    });
