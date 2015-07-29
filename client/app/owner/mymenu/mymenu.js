'use strict';

angular.module('leMeNuApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('owner.mymenu.new', {
                url: '/new',
                templateUrl: 'app/owner/mymenu/newmenu/newmenu.html'
            })
            ;
    });
