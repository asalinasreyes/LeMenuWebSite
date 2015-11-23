'use strict';

angular.module('leMeNuApp')
	.service('TranslationOwner', function($resource) {
		return $resource('/api/translationsowner', {}, {
			getFile: {
				method: 'POST',
				url: '/api/translationsowner/getFile'
			},
			viewTranslation: {
				method: 'GET',
				url: '/api/translationsowner/viewTranslation',
				isArray: true
			},
			ApprovedTranslation: {
				method: 'POST',
				url: '/api/translationsowner/ApprovedTranslation'
			}
		});
	});