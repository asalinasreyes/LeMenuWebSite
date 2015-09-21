'use strict';

angular.module('leMeNuApp')
    .service('DashBoardInfo', function($resource) {
        return $resource('/api/dashboardinfo');
    });
