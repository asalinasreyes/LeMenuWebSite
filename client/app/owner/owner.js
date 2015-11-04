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
            .state('owner.resto', {
                url: '/resto',
                templateUrl: 'app/owner/myrestaurant/myrestaurant.html',
                controller: 'MyRestaurantOwnerCtrl'
            })
            .state('owner.mymenu', {
                url: '/mymenu',
                templateUrl: 'app/owner/mymenu/mymenu.html',
                controller: 'MyRestaurantOwnerMenuCtrl'
            })
            .state('owner.translations', {
                url: '/translations',
                templateUrl: 'app/owner/translation/translation.html',
                controller: 'translationCtrl'
            });
    });