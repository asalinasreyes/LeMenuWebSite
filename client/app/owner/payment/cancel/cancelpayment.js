'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner.payment.cancel', {
                url: '/cancel',
                templateUrl: 'app/owner/payment/cancel/cancelpayment.html',
                controller:'PaymentownerCancelCtrl'
            });
    });
