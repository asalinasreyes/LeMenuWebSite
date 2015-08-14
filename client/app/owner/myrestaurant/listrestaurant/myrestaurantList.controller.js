'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerListCtrl', function($scope, $state, $filter, Restaurant, RestaurantMenu, mySharedService) {
        $scope.ListRestaurants = [];
        $scope.SelectedRestaurant = [];

        $scope.GetListRestaurants = function() {
            Restaurant.query({}, function(listrestaurants) {
                $scope.ListRestaurants = listrestaurants;
                RestaurantMenu.query({}, function(listmenu) {
                    $scope.ListRestaurants.forEach(function(oneThis){
                        oneThis.ListMenu =  $filter('filter')(listmenu, { restaurantid: oneThis._id }); ;
                    });
                });

            });
        };



        $scope.edit = function(itemSelected) {
            mySharedService.prepForBroadcast(itemSelected);
            $state.go('owner.myrestaurant.editrestaurant');
        };


        $scope.addMenu = function(itemSelected) {
            mySharedService.prepForBroadcast(itemSelected);
            $state.go('owner.mymenu.new');
        };



        $scope.GetListRestaurants();
    });
