'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('fakePAYPAL', {
                url: '/fakePAYPAL',
                templateUrl: 'app/Mocks/paypal/paypal.html',
                controller: 'PaypalFakeCtrl'
            });
    });
