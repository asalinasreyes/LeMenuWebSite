'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerListCtrl', function($scope, $state, Restaurant, mySharedService) {
        $scope.ListRestaurants = [];
        $scope.SelectedRestaurant = [];
        $scope.GetListRestaurants = function() {
            Restaurant.query({}, function(listrestaurants) {
                $scope.ListRestaurants = listrestaurants;
            });
        };

        $scope.edit = function(itemSelected) {
            mySharedService.prepForBroadcast(itemSelected);
            $state.go('owner.myrestaurant.editrestaurant');
        };

        $scope.GetListRestaurants();
    });
