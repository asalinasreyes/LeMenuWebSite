'use strict';

angular.module('leMeNuApp')
    .controller('PaymentownerCancelCtrl', function($scope,Auth,  $state) {
    	$state.go('owner.payment.list');
    });