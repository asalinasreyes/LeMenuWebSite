'use strict';

angular.module('leMeNuApp')
    .controller('AdminDashboardCtrl', function($scope, User, DashBoardInfo) {
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
    });
