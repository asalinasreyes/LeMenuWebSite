'use strict';

angular.module('leMeNuApp')
    .service('RestaurantMenu', function($resource) {
        return $resource('/api/restaurant/menu/:id', {
            id: '@_id'
        }, {
            PUT: {
                method: 'PUT'
            }
        });
    });
