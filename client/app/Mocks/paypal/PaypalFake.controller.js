'use strict';

angular.module('leMeNuApp')
    .controller('PaypalFakeCtrl', function($scope, myCache, $http, $state) {

        var infoFake = myCache.get('fakePAYPAL');
        $scope.token = infoFake.TOKEN_Transaction;

        $scope.success = function() {
        	CallPayment('orderExecute');
        };

        $scope.cancel = function() {
        	CallPayment('cancelUrl');
        };

        function CallPayment(nameServices) {
            var req = {
                method: 'GET',
                url: '/api/payment/paypal/'+nameServices,
                params: {
                    order_id: $scope.token
                }
            };
            $http(req).then(function successCallback(response) {
            	$state.go('owner.payment.list');
            }, function errorCallback(response) {
                console.log('Error response', response);
            });
        }

    });
