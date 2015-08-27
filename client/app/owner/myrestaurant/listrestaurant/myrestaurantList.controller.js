'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerListCtrl', function($scope, $state, $filter, Restaurant, RestaurantMenu, myCache) {
        $scope.ListRestaurants = [];
        $scope.SelectedRestaurant = [];

        $scope.goNew = function() {
            $state.go('owner.resto.new');
        };

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

        $scope.goListMenus = function(itemSelected) {
            myCache.set("oneresto", itemSelected);
            $state.go('owner.mymenu.listmenu');
        };
        $scope.oneImage = function(resto) {
            var defaultImgLogo = 'https://placehold.it/380x500';
            if (resto.imglogo)
                defaultImgLogo = resto.imglogo;
            return defaultImgLogo;
        };

        $scope.editrestaurant = function(itemSelected) {
            myCache.set("oneresto", itemSelected);
            $state.go('owner.resto.edit');
        };

        $scope.addMenu = function(itemSelected) {
            myCache.set("oneresto", itemSelected);
            $state.go('owner.mymenu.new');
        };
        $scope.GetListRestaurants();
    });
