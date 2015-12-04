
'use strict';

angular.module('leMeNuApp')
    .controller('AdminDashboardCtrl', function($scope,$translate, ListAllow, User, DashBoardInfo) {

        $scope.oneAtATime = true;
        var lang = $translate.use();
        var listCountries = ListAllow.Countries[lang];
        var mapCountries = [];
        for (var i = listCountries.length - 1; i >= 0; i--) {
            mapCountries[listCountries[i].code] = listCountries[i].name;
        };

        DashBoardInfo.get({}, function(data) {
            $scope.information = data;
        });

        $scope.clearDatabase = function() {
            DashBoardInfo.clearDatabase({}, function(data) {
                DashBoardInfo.get({}, function(data) {
                    $scope.information = data;
                });
            });
        };

        $scope.getflagByID = function(lang){
            return "flag-icon-"+lang._id;
        };

        $scope.getflagByCode = function(code){
            return "flag-icon-"+code;
        };


        $scope.nameCountry = function(lang){
            return mapCountries[lang._id];
        };

        DashBoardInfo.Restaurants({onlyTop:true}, function(listaResto){
            $scope.listaResto = listaResto;
        });

        DashBoardInfo.Restaurants({onlyTop:true}, function(listaMenus){
            $scope.listaMenus = listaMenus;
        });

        DashBoardInfo.Payment({onlyTop:true}, function(listaPayments){
            $scope.listaPayments = listaPayments;
        });

        $scope.getNameCountry = function(codeCountry){
            return mapCountries[codeCountry];
        }
    });
