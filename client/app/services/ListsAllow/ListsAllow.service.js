'use strict';

angular.module('leMeNuApp')
	.service('ListAllow', function() {
		var pathtoimage = '/assets/flags/4x1/';
		var languagesAllow = [{
			id: 1,
			name: 'Español',
			flag: 'es',
			code: 'es'
		}, {
			id: 2,
			name: 'Français',
			flag: 'fr',
			code: 'fr'
		}, {
			id: 3,
			name: 'English',
			flag: 'us',
			code: 'uk'
		}, {
			id: 4,
			name: 'Português',
			flag: 'br',
			code: 'pt'
		}];

		
			return {
				PathToImage: pathtoimage,
				LanguagesAllow: languagesAllow,
				CountryAllow: languagesAllow
			};
		
	});