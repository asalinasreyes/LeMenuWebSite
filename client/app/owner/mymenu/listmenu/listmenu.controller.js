'use strict';

angular.module('leMeNuApp')
    .controller('MyMenuOwnerListCtrl', function($scope, $state, $filter, RestaurantMenu, mySharedService) {
        $scope.ListRestaurantMenus = [];
        $scope.SelectedRestaurant = [];
        $scope.restaurant = mySharedService.message;

        $scope.GetListRestaurants = function() {
            $scope.ListRestaurantMenus = $filter('filter')($scope.restaurant.ListMenu, { restaurantid: $scope.restaurant.restaurantid });    
            
        };

        $scope.edit = function(itemSelected) {
            mySharedService.prepForBroadcast(itemSelected);
            $state.go('owner.myrestaurant.editrestaurant');
        };

        $scope.GetListRestaurants();
    });
