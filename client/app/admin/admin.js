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
            });
    });
