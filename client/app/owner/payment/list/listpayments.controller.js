'use strict';

angular.module('leMeNuApp')
    .controller('PaymentownerListCtrl', function($scope, Payments, Auth) {
    	$scope.user =  Auth.getCurrentUser;
    	Payments.query({}, function(data){
    		$scope.list = data;	
    	});



    	
    });