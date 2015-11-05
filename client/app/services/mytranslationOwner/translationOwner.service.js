'use strict';

angular.module('leMeNuApp')
	.service('TranslationOwner', function($resource) {
		return $resource('/api/translationsowner', {}, {
			getFile: {
				method: 'POST',
				url: '/api/translationsowner/getFile'
			}
		});
	});