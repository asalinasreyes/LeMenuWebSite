'use strict';

angular.module('leMeNuApp')
    .controller('TranslatorEditItemMenuCtrl', function($scope, $window, Queue, $stateParams, $modal) {
        var modalInstance = null;

        $scope.isParent = false;

        $scope.disabledButton = false;
        $scope.ImWorkingOnItemQueue = 0;


        function getInfoInprocess() {
            $scope.disabledButton = true;
            Queue.ImWorkingOnIt({}, function(data) {

            $scope.ImWorkingOnItemQueue =  $stateParams.RowEditing;
            
                $scope.TranslateItem = data[$scope.ImWorkingOnItemQueue];
                $scope.isParent = data[$scope.ImWorkingOnItemQueue].IsParent;

                $scope.getcssFlag = 'flag-icon-' + $scope.TranslateItem.LanguagesTo;
                $scope.workingOver = $scope.TranslateItem.MenuDetail[$stateParams.index];

                $scope.disabledButton = false;
                if (!$scope.workingOver.ItemsInMenu) {
                    $scope.workingOver.ItemsInMenu = [];
                };
            });
        };

        $scope.goBack = function() {
            $window.history.back();
        };


        $scope.saveItemMenu = function(data, id) {
            var result = Queue.SaveMenuAndItems({
                infomenuomenu: $scope.TranslateItem
            }, function success() {
                getInfoInprocess();
            }, function err(err) {
                console.log('error', err);
            });
        };

        $scope.removeItemMenu = function(idRemove) {
            showProcessing();
            var TranslateItem = angular.copy($scope.TranslateItem);
            TranslateItem.MenuDetail[$stateParams.index].ItemsInMenu.splice(idRemove, 1);

            Queue.SaveMenuAndItems({
                infomenuomenu: TranslateItem
            }, function success() {
                getInfoInprocess();
            }, function err(err) {
                modalInstance.close();
                console.log('error', err);
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