'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerListCtrl', function($scope, $state, $filter, Restaurant, RestaurantMenu, mySharedService) {
        $scope.ListRestaurants = [];
        $scope.SelectedRestaurant = [];

        $scope.GetListRestaurants = function() {
            Restaurant.query({}, function(listrestaurants) {
                $scope.ListRestaurants = listrestaurants;
                RestaurantMenu.query({}, function(listmenu) {
                    $scope.ListRestaurants.forEach(function(oneThis) {
                        oneThis.ListMenu = $filter('filter')(listmenu, {
                            restaurantid: oneThis._id
                        });;
                    });
                });

            });
        };



        $scope.editrestaurant = function(itemSelected) {
            mySharedService.prepForBroadcast(itemSelected);
            $state.go('owner.myrestaurant.editrestaurant');
        };

        $scope.goEditMenu = function(onerestaurant, ItemMenuSelected) {
            onerestaurant.ItemMenuSelected = ItemMenuSelected;
            mySharedService.prepForBroadcast(onerestaurant);
            $state.go('owner.mymenu.edit');
        }

        $scope.addMenu = function(itemSelected) {
            mySharedService.prepForBroadcast(itemSelected);
            $state.go('owner.mymenu.new');
        };

        $scope.goListMenus = function() {
            $state.go('owner.mymenu.listmenu', {}, {
                reload: true
            });
        };



        $scope.GetListRestaurants();
    });