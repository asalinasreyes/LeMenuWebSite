'use strict';

angular.module('leMeNuApp')
    .controller('AdminListRestaurantsCtrl', function($scope, $translate, ListAllow, User, DashBoardInfo) {

        var lang = $translate.use();
        var listCountries = ListAllow.Countries[lang];
        var mapCountries = [];
        for (var i = listCountries.length - 1; i >= 0; i--) {
            mapCountries[listCountries[i].code] = listCountries[i].name;
        };

        DashBoardInfo.Restaurants({
            onlyTop: false
        }, function(listaResto) {
            $scope.listaResto = listaResto;
            for (var i = listaResto.length - 1; i >= 0; i--) {
                listaResto[i].nameCountry = mapCountries[listaResto[i].country];
            };
            $scope.listaResto  = listaResto;

        });

/*
        DashBoardInfo.Restaurants({
            onlyTop: true
        }, function(listaMenus) {
            $scope.listaMenus = listaMenus;
        });

        DashBoardInfo.Payment({
            onlyTop: true
        }, function(listaPayments) {
            $scope.listaPayments = listaPayments;
        });
*/

        $scope.getNameCountry = function(codeCountry) {
            return mapCountries[codeCountry];
        }

        $scope.getflagByCode = function(code) {
            return "flag-icon-" + code;
        };

    });
