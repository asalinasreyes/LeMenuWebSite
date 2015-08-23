'use strict';

angular.module('leMeNuApp')
    .controller('PaymentownerCtrl', function($scope, $http, myCache, Auth, $modal) {
        $scope.PriceSubTotal = 12;
        $scope.RestaurantSelectedInfo = myCache.get("oneresto");
        $scope.showError = false;
        $scope.getCurrentUser = Auth.getCurrentUser;
        if ($scope.RestaurantSelectedInfo.ItemMenuSelected != undefined) {
            $scope.paymentMenuSeleted = $scope.RestaurantSelectedInfo.ItemMenuSelected;
            var numberFiles = $scope.paymentMenuSeleted.files.length;

            $scope.infoInformation = {
                date: new Date(),
                price: 10,
                countpage: numberFiles,
                priceTotal: numberFiles * 10,
                menuid: $scope.paymentMenuSeleted._id,
                restaurantid: $scope.RestaurantSelectedInfo._id,
                methodpayment: 'paypal',
                user: $scope.getCurrentUser()
            };

        };



        $scope.startPayment = function() {
            loadpopup();
            $http.post('api/payment/paypal/startPayment', $scope.infoInformation)
                .then(function(response) {
                    var redirectUrl = response.data.redirectUrl;
                    window.location = redirectUrl;
                }, function(response) {
                    console.log('error ', response);
                    if (response.status == 500) {
                        $scope.showError = true;
                        console.log('error en pago, tipo no reconocido', response.data.type);
                    };
                });
        };

        function loadpopup() {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContentPayment.html',
                backdrop: 'static'
            });
        };
    });