'use strict';

angular.module('leMeNuApp')
	.service('Mylocation', function($http, localStorageService, myCache) {



		$http({method:'GET', url:'http://ipinfo.io/json'}).
		success(function(data, status, headers, config){
			var latitud = data.loc.split(",")[0];
			var longitud = data.loc.split(",")[0];
			data.latitud = latitud;
			data.longitud = longitud;

			myCache.set("Mylocation", data);
		});

		return {
			fulldata: myCache.get("Mylocation")
		}
	});
