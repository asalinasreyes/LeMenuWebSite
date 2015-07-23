'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerEditCtrl', function($scope, $state, Restaurant, mySharedService) {

        $scope.restauranteedit = mySharedService.message;
    	$scope.SaveNewRestaurant = function() {
            Restaurant.PUT($scope.restauranteedit, function(info) {
                $scope.restauranteedit = {};
                $state.go('owner.myrestaurant', {}, {
                    reload: true
                });
            });
        };


        $scope.back= function(){
        	$state.go('owner.myrestaurant', {}, {reload: true});
        };

    });
