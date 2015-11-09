'use strict';

angular.module('leMeNuApp')
	.controller('TranslatorMyListTranslationsCtrl', function($scope, Queue) {

		Queue.GetListTranslationDone({},
			function success(data) {
				$scope.listTranslations= data;
			},
			function err(err) {

			});
	});