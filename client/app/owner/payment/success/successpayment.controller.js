'use strict';

angular.module('leMeNuApp')
    .controller('PaymentownerSuccesCtrl', function($scope,Auth, $state ) {
    	//$state.go('owner.resto');
    	
    	$state.go('owner.payment.list');
    });