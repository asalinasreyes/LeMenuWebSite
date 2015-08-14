'use strict';

angular.module('leMeNuApp')
    .controller('MyMenuOwnerListCtrl', function($scope, $state, $filter, RestaurantMenu, mySharedService) {
        $scope.ListRestaurantMenus = [];
        $scope.SelectedRestaurant = [];
        $scope.restaurant = mySharedService.message;

        $scope.GetListRestaurants = function() {
            RestaurantMenu.query({}, function(listrestaurantMenus) {
                $scope.ListRestaurantMenus = $filter('filter')(listrestaurantMenus, { restaurantid: $scope.restaurant.restaurantid });    
            });
        };

        $scope.edit = function(itemSelected) {
            mySharedService.prepForBroadcast(itemSelected);
            $state.go('owner.myrestaurant.editrestaurant');
        };

        $scope.GetListRestaurants();
    });
