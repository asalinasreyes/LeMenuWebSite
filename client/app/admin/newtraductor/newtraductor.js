'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.newtrad', {
                url: '/translator',
                templateUrl: 'app/admin/newtraductor/newtraductor.html',
                controller: 'AdminNewTrandCtrl'
            });
    });
