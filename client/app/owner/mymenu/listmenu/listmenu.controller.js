'use strict';

angular.module('leMeNuApp')
    .controller('MyMenuOwnerListCtrl', function($scope, $state, RestaurantMenu, mySharedService) {
        $scope.ListRestaurantMenus = [];
        $scope.SelectedRestaurant = [];
        $scope.GetListRestaurants = function() {
            RestaurantMenu.query({}, function(listrestaurantMenus) {
                $scope.ListRestaurantMenus = listrestaurantMenus;
            });
        };

        $scope.edit = function(itemSelected) {
            mySharedService.prepForBroadcast(itemSelected);
            $state.go('owner.myrestaurant.editrestaurant');
        };

        $scope.GetListRestaurants();
    });
