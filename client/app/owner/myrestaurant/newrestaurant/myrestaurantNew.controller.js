'use strict';

angular.module('leMeNuApp')
    .directive('validateEmail', function() {
        var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

        return {
            require: 'ngModel',
            restrict: '',
            link: function(scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {

                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function(modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    })
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
