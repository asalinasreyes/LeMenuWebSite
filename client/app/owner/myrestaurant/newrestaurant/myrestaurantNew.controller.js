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
            var mylocation = Mylocation.location()
            if (mylocation) {
                $scope.restaurant.country = mylocation.country;
                $scope.restaurant.city = mylocation.city;
                $scope.restaurant.latitude = mylocation.latitud;
                $scope.restaurant.longitude = mylocation.longitud;
            };

        };
        updateCountry();
    });
