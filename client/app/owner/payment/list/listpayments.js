'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner.payment.list', {
                url: '/list',
                templateUrl: 'app/owner/payment/list/listpayments.html',
                controller:'PaymentownerListCtrl'
            });
    });

