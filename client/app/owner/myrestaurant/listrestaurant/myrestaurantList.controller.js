'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerListCtrl', function($scope, $state, $filter, Restaurant, RestaurantMenu, myCache) {
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


        $scope.isPayed = function(menu){
            if (menu.status=='success') {
                return true;
            };
        }
        $scope.editrestaurant = function(itemSelected) {
            myCache.set("oneresto", itemSelected);
            $state.go('owner.myrestaurant.editrestaurant');
        };

        $scope.goEditMenu = function(onerestaurant, ItemMenuSelected) {
            onerestaurant.ItemMenuSelected = ItemMenuSelected;
            myCache.set("oneresto", onerestaurant);
            $state.go('owner.mymenu.edit');
        }

        $scope.addMenu = function(itemSelected) {
            myCache.set("oneresto", itemSelected);
            $state.go('owner.mymenu.new');
        };

        $scope.goListMenus = function(itemSelected) {
            myCache.set("oneresto", itemSelected);
            $state.go('owner.mymenu.listmenu', {}, {
                reload: true
            });
        };

        $scope.goPayment = function(onerestaurant, ItemMenuSelected) {
            onerestaurant.ItemMenuSelected = ItemMenuSelected;
            myCache.set("oneresto", onerestaurant);
            $state.go('owner.payment');
        };



        $scope.GetListRestaurants();
    });