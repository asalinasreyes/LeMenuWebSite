'use strict';

angular.module('leMeNuApp')
	.controller('PaymentownerCtrl', function($scope, myCache) {
		$scope.PriceSubTotal = 12;
		$scope.RestaurantSelectedInfo = myCache.get("oneresto");

		$scope.paymentMenuSeleted = $scope.RestaurantSelectedInfo.ItemMenuSelected;
		var numberFiles = $scope.paymentMenuSeleted.files.length;

		$scope.infoInformation = {
			date: new Date(),
			price: 10,
			countpage: numberFiles,
			priceTotal: numberFiles * 10
		};


	});