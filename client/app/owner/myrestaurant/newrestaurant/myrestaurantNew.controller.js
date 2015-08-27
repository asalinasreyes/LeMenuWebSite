'use strict';

angular.module('leMeNuApp')
    .controller('MyRestaurantOwnerNewCtrl', function($scope, $state, Restaurant, myCache, ListAllow, $translate) {

        $scope.restaurante = {};
        $scope.restaurante.name = '';
        var lang = $translate.use();
        $scope.Countries = ListAllow.Countries[lang];
        $scope.SaveNewRestaurant = function() {
            $scope.restaurante.language =  getLang();
            $scope.restaurante.ListMenu = [];
            Restaurant.save($scope.restaurante, function(info) {
                $scope.restaurante = {};
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

        }

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
