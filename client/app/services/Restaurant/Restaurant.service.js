'use strict';

angular.module('leMeNuApp')
    .service('Restaurant', function($resource) {
        return $resource('/api/restaurants/:id', {
            id: '@_id'
        }, {
            PUT: {
                method: 'PUT'
            }
        });
    });
