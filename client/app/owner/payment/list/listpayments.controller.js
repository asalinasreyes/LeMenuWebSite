'use strict';

angular.module('leMeNuApp')
    .controller('PaymentownerListCtrl', function($scope, Payments) {
    	Payments.query({}, function(data){
    		$scope.listpayments = data;	
    	});
    	
    });