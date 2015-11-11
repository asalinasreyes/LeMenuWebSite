'use strict';

angular.module('leMeNuApp')
    .controller('PaymentownerCtrl', function($scope, $http, myCache, Auth, $modal, InvoiceInfo, $state) {
        $scope.PriceSubTotal = 12;
        $scope.RestaurantSelectedInfo = myCache.get("oneresto");
        $scope.showError = false;
        $scope.getCurrentUser = Auth.getCurrentUser;
        var modalInstance=null;

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
                    if (response.data && response.data.redirectUrl) {
                        if (response.data.redirectUrl == '/fakePAYPAL') {
                            myCache.set("fakePAYPAL",response.data);
                            setTimeout(function(){
                                modalInstance.close();
                            $state.go('fakePAYPAL');
                            }, 3000);
                        } else {
                            var redirectUrl = response.data.redirectUrl;
                            window.location = redirectUrl;
                        }
                    }
                }, function(response) {
                    if (response.status == 503) {
                        $scope.showError = true;
                    }
                });
        };

        function loadpopup() {
            modalInstance = $modal.open({
                templateUrl: 'myModalContentPayment.html',
                backdrop: 'static'
            });
        };
    });
