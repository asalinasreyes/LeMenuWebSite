'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerListCtrl', function($scope, $state, $filter, Restaurant, RestaurantMenu, myCache) {
        $scope.ListRestaurants = [];
        $scope.SelectedRestaurant = [];

        $scope.firstTime = true;

        $scope.goNew = function() {
            $state.go('owner.resto.new');
        };

        $scope.firstTimeClass = 'listrestofirsttime';

        $scope.GetListRestaurants = function() {
            Restaurant.query({}, function(listrestaurants) {
                $scope.ListRestaurants = listrestaurants;
                RestaurantMenu.query({}, function(listmenu) {
                    if (listmenu.length > 0) {
                        $scope.firstTime = false;
                        $scope.firstTimeClass = 'listresto';
                    }
                    $scope.ListRestaurants.forEach(function(oneThis) {
                        oneThis.ListMenu = $filter('filter')(listmenu, {
                            Restaurantid: oneThis._id
                        });;
                    });
                });
            });
        };

        $scope.existMenus = function(resto) {
            var emptyNotMenu = true;
            if (resto.ListMenu && resto.ListMenu.length > 0) {
                emptyNotMenu = false;
            };
            return emptyNotMenu;
        };

        $scope.goListMenus = function(itemSelected) {

            if (itemSelected.ListMenu && itemSelected.ListMenu.length > 0) {
                myCache.set("oneresto", itemSelected);
                $state.go('owner.mymenu.listmenu');
            }
        };
        $scope.oneImage = function(resto) {
            var defaultImgLogo = '../assets/images/staticname/yourLogo.png';
            if (resto.urllogo) {
                defaultImgLogo = resto.urllogo;
            }
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

        $scope.getcssFlag = function(country) {
            return 'flag-icon-' + country;
        };

        $scope.GetListRestaurants();
    });
