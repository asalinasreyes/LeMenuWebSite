'use strict';

angular.module('leMeNuApp')
	.controller('PaymentownerCtrl', function($scope, $state, $modal, mySharedService) {
		$scope.PriceSubTotal = 12;

		$scope.RestaurantSelectedInfo = mySharedService.message;
		
		$scope.paymentMenuSeleted = $scope.RestaurantSelectedInfo.ItemMenuSelected;
		var numberFiles = $scope.paymentMenuSeleted.files.length;

			$scope.infoInformation  = {
			date: new Date(),
			price: 10,
			countpage: numberFiles,
			priceTotal: numberFiles * 10
		};
	
		
	});