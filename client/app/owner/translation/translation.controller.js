'use strict';

angular.module('leMeNuApp')
	.controller('translationCtrl', function($scope, TranslationOwner) {
		$scope.CreatedFiles = [];

		TranslationOwner.query({}, function(data) {
			$scope.ListTranslation = data;
		});

		$scope.download = function(restoInfo) {
			TranslationOwner.getFile({
				restoInfo
			}, function(data) {
				$scope.CreatedFiles.push({
					id: restoInfo._id,
					language: restoInfo.LanguagesTo,
					fullpath: data.fullpath,
					filename: data.name
				});
			});
		};

		$scope.isFileCreated = function(row) {
			var filesExists = _.where($scope.CreatedFiles, {
				id: row._id,
				language: row.LanguagesTo
			});
			return filesExists.length > 0;
		};

		$scope.viewTranslation = function(restoInfo) {
			var queryParams = {
				queuedID: restoInfo._id,
				Restaurantid: restoInfo.Restaurantid._id,
				LanguagesTo: restoInfo.LanguagesTo
			};

			TranslationOwner.viewTranslation(queryParams, function(data) {
				$scope.viewMenu = data;
			});
		};

		$scope.getFilePath = function(row) {
			var filename = '';
			if (row._id) {
				var filesExists = _.where($scope.CreatedFiles, {
					id: row._id,
					language: row.LanguagesTo
				});
				if (filesExists.length > 0) {
					filename = filesExists[0].fullpath;
				};
			}
			return filename;
		}

	});