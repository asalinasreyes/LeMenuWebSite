'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner.mymenu.new', {
                url: '/new',
                templateUrl: 'app/owner/mymenu/newmenu/newmenu.html'
            })
            .state('owner.mymenu.edit', {
                url: '/edit',
                templateUrl: 'app/owner/mymenu/editmenu/editmenu.html'
            })
            .state('owner.mymenu.listmenu', {
                url: '/list',
                templateUrl: 'app/owner/mymenu/listmenu/listmenu.html'
            })
            ;
    });
