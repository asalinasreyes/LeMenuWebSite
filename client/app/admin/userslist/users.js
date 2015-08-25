'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.users', {
                url: '/users',
                templateUrl: 'app/admin/userslist/users.html',
                controller: 'AdminUsersListCtrl'
            });
    });
