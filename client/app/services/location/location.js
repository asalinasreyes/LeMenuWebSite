'use strict';

angular.module('leMeNuApp')
	.service('Mylocation', function($http, localStorageService, myCache) {
		myCache.set('Mylocation', '');
		$http({method:'GET', url:'http://ipinfo.io/json'}).
		success(function(data, status, headers, config){
			var latitud = data.loc.split(",")[0];
			var longitud = data.loc.split(",")[1];
			data.latitud = latitud;
			data.longitud = longitud;

			myCache.set('Mylocation', data);
		});

		this.location = function(){
			return  myCache.get('Mylocation')
		};
	});
