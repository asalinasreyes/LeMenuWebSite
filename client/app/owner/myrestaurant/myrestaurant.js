'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner.resto.new', {
                url: '/new',
                templateUrl: 'app/owner/myrestaurant/newrestaurant/myrestaurantNew.html'
            })
            .state('owner.resto.list', {
                url: '/list',
                templateUrl: 'app/owner/myrestaurant/listrestaurant/myrestaurantList.html'
            })
            .state('owner.resto.edit', {
                url: '/edit',
                templateUrl: 'app/owner/myrestaurant/editrestaurant/myrestaurantEdit.html'
            });

    });
