'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner.myrestaurant.newrestaurant', {
                url: '/myrestaurant/new',
                templateUrl: 'app/owner/myrestaurant/newrestaurant/myrestaurantNew.html'
            })
            .state('owner.myrestaurant.listrestaurant', {
                url: '/myrestaurant/list',
                templateUrl: 'app/owner/myrestaurant/listrestaurant/myrestaurantList.html'
            })
            .state('owner.myrestaurant.editrestaurant', {
                url: '/edit',
                templateUrl: 'app/owner/myrestaurant/editrestaurant/myrestaurantEdit.html'
            });

    });
