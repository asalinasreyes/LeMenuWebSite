'use strict';

angular.module('leMeNuApp')
    .service('InvoiceInfo', function($resource) {
        return $resource('/api/invoice/', {});
    });
