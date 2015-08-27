'use strict';

angular.module('leMeNuApp')
    .controller('MyMenuOwnerListCtrl', function($scope, $state, $filter, myCache, toaster, $timeout) {
        $scope.ListRestaurantMenus = [];
        $scope.SelectedRestaurant = [];
        $scope.restaurant = myCache.get("oneresto");
        $scope.messageToaster = '';
        if (!$scope.restaurant.ListMenu) {
            ShowmessageEmptyMenu();
        }else if ($scope.restaurant.ListMenu.length == 0) {
                ShowmessageEmptyMenu();
            };

        $scope.GetListRestaurants = function() {
            $scope.ListRestaurantMenus = $filter('filter')($scope.restaurant.ListMenu, {
                restaurantid: $scope.restaurant.restaurantid
            });
        };

        $scope.goeditmenu = function(itemSelected) {
            if (!itemSelected.status) {
                itemSelected.status = '';
            };
            $scope.restaurant.ItemMenuSelected = itemSelected;
            myCache.set("oneresto", $scope.restaurant);
            $state.go('owner.mymenu.edit');
        };


        $scope.goPayment = function(itemSelected) {
            $scope.restaurant.ItemMenuSelected = itemSelected;
            myCache.set("oneresto", $scope.restaurant);
            $state.go('owner.payment');
        };


        $scope.isPayed = function(menu) {
            if (menu.status == 'success') {
                return true;
            };
        };
        $scope.GetListRestaurants();

        function ShowmessageEmptyMenu() {
            toaster.pop({
                type: 'info',
                bodyOutputType: 'template',
                body: 'notification.html'
            });
            $scope.messageToaster = 'menu.list.empty';
            $timeout(function() {
                $state.go('owner.mymenu.new');
            }, 2000);

        };
    });
