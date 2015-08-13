'use strict';

angular.module('leMeNuApp')
    .service('RestaurantMenu', function($resource) {
        return $resource('/api/restaurants/menuofrestaurant/:id', {
            id: '@_id'
        }, {
            PUT: {
                method: 'PUT'
            }
        });
    });
