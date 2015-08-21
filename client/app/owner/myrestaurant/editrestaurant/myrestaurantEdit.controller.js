'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerEditCtrl', function($scope, $state, Restaurant, myCache) {
        $scope.restaurante = {};
        $scope.restaurante = myCache.get("oneresto");

        $scope.SaveNewRestaurant = function() {
            Restaurant.PUT($scope.restaurante, function(info) {
                $scope.restaurante = {};
                $state.go('owner.myrestaurant', {}, {
                    reload: true
                });
            });
        };

        $scope.back = function() {
            $state.go('owner.myrestaurant', {}, {
                reload: true
            });
        };

    });