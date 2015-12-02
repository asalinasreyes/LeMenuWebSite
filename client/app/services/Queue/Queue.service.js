'use strict';

angular.module('leMeNuApp')
    .service('Queue', function($resource) {
        return $resource('/api/queue/:id', {
            id: '@_id'
        }, {
            PUT: {
                method: 'PUT'
            },
            FinnishedTranslation: {
                method: 'POST',
                url: '/api/queue/FinnishedTranslation',
                params: {
                    infomenuomenu: '@info'
                }
            },
            StartFixComplaint: {
                method: 'POST',
                url: '/api/queue/StartFixComplaint/',
                params: {
                    infomenuomenu: '@info'
                }
            },
            CloseComplaint: {
                method: 'POST',
                url: '/api/queue/CloseComplaint/',
                params: {
                    infomenuomenu: '@info'
                }
            },
            SaveMenuAndItems: {
                method: 'POST',
                url: '/api/queue/menuAndItems/',
                params: {
                    infomenuomenu: '@info'
                }
            },
            ImWorkingOnIt: {
                method: 'GET',
                url: '/api/queue/ImWorkingOnIt',
                isArray: true
            },
            GetListTranslationDone: {
                method: 'GET',
                url: '/api/queue/GetListTranslationDone',
                isArray: true
            }
        });
    });