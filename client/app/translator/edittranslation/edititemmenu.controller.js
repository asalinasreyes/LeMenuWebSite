'use strict';

angular.module('leMeNuApp')
    .controller('TranslatorEditItemMenuCtrl', function($scope, $window, Queue, $stateParams, $modal) {
        var modalInstance = null;


        function getInfoInprocess() {
            Queue.ImWorkingOnIt({}, function(data) {
                $scope.TranslateItem = data[0];
                $scope.workingOver = $scope.TranslateItem.MenuDetail[$stateParams.index];
                if (!$scope.workingOver.ItemsInMenu) {
                    $scope.workingOver.ItemsInMenu = [];
                };

            });

        }

        $scope.goBack = function() {
            $window.history.back();
        };


        $scope.saveItemMenu = function(data, id) {
            console.log('guardando data', data);
            Queue.SaveMenuAndItems({
                infomenuomenu: $scope.TranslateItem
            }, function(itemsSave) {
                getInfoInprocess();
            });
        };

        $scope.removeItemMenu = function(idRemove) {

            showProcessing();
            var TranslateItem = angular.copy($scope.TranslateItem);
            TranslateItem.MenuDetail[$stateParams.index].ItemsInMenu.splice(idRemove, 1);

            Queue.SaveMenuAndItems({
                infomenuomenu: TranslateItem
            }, function(data) {
                getInfoInprocess()
                modalInstance.close();
            });
        };

        $scope.addItemInGroud = function() {

            $scope.inserted = {
                Namedescription: '',
                DescriptionItemMenu: '',
                DescriptionItemsItemMenu: '',
                PriceItemsItemMenu: '',
                PositionOrder: $scope.workingOver.ItemsInMenu.length
            };
            $scope.workingOver.ItemsInMenu.push($scope.inserted);

        };

        function showProcessing() {
            modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                backdrop: 'static'
            });
        };

        $scope.showBottonButton = function() {
            if ($scope.workingOver && $scope.workingOver.ItemsInMenu) {
                return $scope.workingOver.ItemsInMenu.length > 1;
            };
            return false;
        }

        getInfoInprocess();
    });
