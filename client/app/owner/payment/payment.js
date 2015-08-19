'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner.payment', {
                url: '/payment',
                templateUrl: 'app/owner/payment/payment.html'
            })

    });
