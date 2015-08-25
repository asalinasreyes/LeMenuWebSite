'use strict';

angular.module('leMeNuApp')
    .factory('myCache', function(localStorageService) {
        return localStorageService;
    })
