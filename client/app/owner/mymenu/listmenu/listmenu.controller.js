'use strict';

angular.module('leMeNuApp')
    .controller('MyMenuOwnerListCtrl', function($scope, $state, $filter, RestaurantMenu, myCache) {
        $scope.ListRestaurantMenus = [];
        $scope.SelectedRestaurant = [];
        $scope.restaurant = myCache.get("oneresto");

        $scope.GetListRestaurants = function() {
            $scope.ListRestaurantMenus = $filter('filter')($scope.restaurant.ListMenu, { restaurantid: $scope.restaurant.restaurantid });      
        };

        $scope.goeditResto = function(itemSelected) {
            myCache.set("onemenu", itemSelected);
            $state.go('owner.myrestaurant.editrestaurant');
        };

        $scope.GetListRestaurants();
    });
