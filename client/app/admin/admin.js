'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminCtrl'
            })
            .state('admin.users', {
                url: '/users',
                templateUrl: 'app/admin/userslist/users.html',
                controller: 'AdminUsersListCtrl'
            })
            .state('admin.dashboard', {
                url: '/home',
                templateUrl: 'app/admin/dashboard/dashboard.html',
                controller: 'AdminDashboardCtrl'
            })
            .state('admin.restaurants', {
                url: '/restaurants',
                templateUrl: 'app/admin/dashboard/listrestaurants/listrestaurants.html',
                controller: 'AdminListRestaurantsCtrl'
            })
            .state('admin.restaurants.menus', {
                url: '/menus/:restaurant',
                templateUrl: 'app/admin/dashboard/listmenus/listmenus.html',
                controller: 'AdminListMenusCtrl'
            })
            .state('admin.complaint', {
                url: '/complaints',
                templateUrl: 'app/admin/dashboard/listcomplaints/listcomplaints.html',
                controller: 'AdminListComplaintCtrl'
            })
            ;
    });
