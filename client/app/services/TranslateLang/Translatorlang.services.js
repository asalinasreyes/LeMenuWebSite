'use strict';

angular.module('leMeNuApp')
    .service('Translatorlanguages', function($resource) {
        return $resource('/api/translatorlanguage/:id', {
            id: '@_id'
        }, {
            PUT: {
                method: 'PUT'
            }
        });
    });

