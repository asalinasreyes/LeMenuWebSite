'use strict';

angular.module('leMeNuApp')
    .service('DashBoardInfo', function($resource) {
        return $resource('/api/dashboardinfo', {}, {
            clearDatabase: {
                method: 'GET',
                url: '/api/dashboardinfo/clearDatabase'
            },
            Restaurants: {
                method: 'GET',
                url: '/api/dashboardinfo/Restaurants',
                params: {
                    onlyTop: '@onlyTop'
                },
                isArray: true
            },
            Menus: {
                method: 'GET',
                url: '/api/dashboardinfo/Menus',
                onlyTop: '@onlyTop',
                isArray: true
            },
            MenusByIDResto: {
                method: 'GET',
                url: '/api/dashboardinfo/MenusByIDResto',
                idResto: '@idResto'
            },
            Payment: {
                method: 'GET',
                url: '/api/dashboardinfo/Payments',
                onlyTop: '@onlyTop',
                isArray: true
            },
            GetListTranslations:{
                method: 'GET',
                url: '/api/dashboardinfo/GetListTranslations',
                isArray: true
            },
            viewTranslation:{
                method: 'GET',
                url: '/api/dashboardinfo/viewTranslation',
                isArray: true
            },
            Complaints: {
                method: 'GET',
                url: '/api/dashboardinfo/Complaint',
                isArray: true
            }
        });
    });
