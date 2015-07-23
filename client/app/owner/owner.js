'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner', {
                url: '/owner',
                templateUrl: 'app/owner/owner.html',
                controller: 'OwnerCtrl'
            })
            .state('owner.dashboard', {
                url: '/dashboard',
                templateUrl: 'app/owner/dashboard/dashboard.html',
                controller: 'dashboardCtrl'
            })
            .state('owner.myrestaurant', {
                url: '/myrestaurant',
                templateUrl: 'app/owner/myrestaurant/myrestaurant.html',
                controller: 'MyRestaurantOwnerCtrl'
            })
            .state('owner.payment', {
                url: '/payment',
                templateUrl: 'app/owner/payment/payment.html',
                controller: 'PaymentownerCtrl'
            });
    });
