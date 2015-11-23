'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('fakePAYPAL', {
                url: '/fakePAYPAL',
                templateUrl: 'app/mocks/paypal/paypalmock.html',
                controller: 'PaypalFakeCtrl'
            });
    });
