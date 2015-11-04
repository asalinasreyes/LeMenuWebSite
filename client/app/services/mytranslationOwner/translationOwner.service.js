'use strict';

angular.module('leMeNuApp')
    .service('TranslationOwner', function($resource) {
        return $resource('/api/translationsowner', {}, {
            getFile: {
                method: 'GET',
                url: '/api/translationsowner/getFile',
                headers: {
                    accept: 'application/text'
                },
                cache: true,
                transformResponse: function(data) {
                    var pdf;
                    if (data) {
                        pdf = new Blob([data], {
                            type: 'application/text'
                        });
                    }
                    return {
                        response: pdf
                    };
                }
            }
        });
    });
