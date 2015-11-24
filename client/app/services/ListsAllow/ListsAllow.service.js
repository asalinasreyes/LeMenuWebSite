'use strict';

angular.module('leMeNuApp')
	.service('ListAllow', function() {
		var languagesAllow = [{
			id: 1,
			name: 'Español',
			flag: 'es',
			code: 'es',
			locale: 'es'
		}, {
			id: 2,
			name: 'Français',
			flag: 'fr',
			code: 'fr',
			locale: 'fr'
		}, {
			id: 3,
			name: 'English',
			flag: 'us',
			code: 'en',
			locale: 'en'
		}, {
			id: 4,
			name: 'Português',
			flag: 'br',
			code: 'pt',
			locale: 'pt'
		}];
	
		return {
			LanguagesAllow: languagesAllow,
			CountryAllow: languagesAllow,
			Countries:Countries
		};

	});