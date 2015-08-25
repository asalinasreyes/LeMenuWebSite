'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerNewCtrl', function($scope, $state, Restaurant, myCache ) {
        $scope.restaurante = {};
        $scope.restaurante.name='';
        $scope.SaveNewRestaurant = function() {
            Restaurant.save($scope.restaurante, function(info) {
            	$scope.restaurante = {};
                myCache.set("oneresto", info);
            	$state.go('owner.mymenu', {}, {reload: true});
            });
        };

        $scope.back= function(){
        	$state.go('owner.resto', {}, {reload: true});
        };

        $scope.readyForSave = function  () {

        }
    });
