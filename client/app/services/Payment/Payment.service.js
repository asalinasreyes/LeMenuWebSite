'use strict';

angular.module('leMeNuApp')
    .service('Payments', function($resource) {
        return $resource('/api/payments');
    });
