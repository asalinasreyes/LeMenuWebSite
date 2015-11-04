'use strict';

angular.module('leMeNuApp')
    .controller('PaymentownerCtrl', function($scope, $http, myCache, Auth, $modal, InvoiceInfo) {
        $scope.PriceSubTotal = 12;
        $scope.RestaurantSelectedInfo = myCache.get("oneresto");
        $scope.showError = false;
        $scope.getCurrentUser = Auth.getCurrentUser;

        if ($scope.RestaurantSelectedInfo) {
            if ($scope.RestaurantSelectedInfo.ItemMenuSelected != undefined) {
                $scope.paymentMenuSeleted = $scope.RestaurantSelectedInfo.ItemMenuSelected;
                try {
                    $scope.infopayment = InvoiceInfo.get({
                        menuid: $scope.paymentMenuSeleted._id
                    });

                    $scope.infoInformation = {
                        date: new Date(),
                        price: $scope.infopayment.priceBypage,
                        countpage: $scope.infopayment.numberPage,
                        priceTotal: $scope.infopayment.TotalPrice,
                        menuid: $scope.paymentMenuSeleted._id,
                        Restaurantid: $scope.RestaurantSelectedInfo._id,
                        methodpayment: 'paypal',
                        user: $scope.getCurrentUser()
                    };
                } catch (e) {

                }
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
