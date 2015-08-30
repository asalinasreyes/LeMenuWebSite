'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerEditCtrl', function($scope, $state, Restaurant, myCache, ListAllow, $translate) {
        $scope.restaurante = {};
        $scope.restaurante = myCache.get("oneresto");

        var lang = $translate.use();

        $scope.Countries = ListAllow.Countries[lang];

        $scope.SaveNewRestaurant = function() {
            $scope.restaurante.language =  getLang();
            Restaurant.PUT($scope.restaurante, function(info) {
                $scope.restaurante = {};
                $state.go('owner.resto', {}, {
                    reload: true
                });
            });
        };

        $scope.back = function() {
            $state.go('owner.resto', {}, {
                reload: true
            });
        };

        function getLang (argument) {
            var defaultLang ='en';
            $scope.Countries.forEach(function(country){
               if (country.code==$scope.restaurante.country) {
                defaultLang =country.lang;
               }; 
            }) 
            return defaultLang
        }   
    });