'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerNewCtrl', function($scope, $state, Restaurant, myCache, ListAllow, $translate, Mylocation) {

        $scope.restaurant = {};
        var lang = $translate.use();
        $scope.Countries = ListAllow.Countries[lang];
        $scope.SaveNewRestaurant = function() {
            $scope.restaurant.language = getLang();
            $scope.restaurant.ListMenu = [];
            Restaurant.save($scope.restaurant, function(info) {
                $scope.restaurant = {};
                myCache.set("oneresto", info);
                $state.go('owner.mymenu.new', {}, {
                    reload: true
                });
            });
        };

        $scope.back = function() {
            $state.go('owner.resto', {}, {
                reload: true
            });
        };

        $scope.readyForSave = function() {

        };

        function getLang(argument) {
            var defaultLang = 'en';
            $scope.Countries.forEach(function(country) {
                if (country.code == $scope.restaurant.country) {
                    defaultLang = country.lang;
                };
            });
            return defaultLang;
        };

        function updateCountry() {
            if (Mylocation.fulldata.country) {
                $scope.restaurant.country = Mylocation.fulldata.country;
                $scope.restaurant.city = Mylocation.fulldata.city;
                $scope.restaurant.latitude = Mylocation.fulldata.latitud;
                $scope.restaurant.longitude = Mylocation.fulldata.longitud;
            };

        };
        updateCountry();
    });
