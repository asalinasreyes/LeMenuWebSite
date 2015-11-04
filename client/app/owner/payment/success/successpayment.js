'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner.payment.success', {
                url: '/success',
                templateUrl: 'app/owner/payment/success/successpayment.html',
                controller: 'PaymentownerSuccesCtrl'
            });
    });

