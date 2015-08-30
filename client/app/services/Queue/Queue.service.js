'use strict';

angular.module('leMeNuApp')
	.service('Queue', function($resource) {
		return $resource('/api/queue/:id', {
			id: '@_id'
		}, {
			PUT: {
				method: 'PUT'
			},
			ImWorkingOnIt:{
				method:'GET',
				url:'/api/queue/ImWorkingOnIt',isArray: true
			}
		});
	});