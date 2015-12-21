'use strict';

angular.module('leMeNuApp')
    .controller('TranslatorEditCtrl', function($scope, Queue, $filter, $http, $state) {

        $scope.isParent = false;

        $scope.isShowButtonMoveToNext = false;
        $scope.ListQueueInProcess = [];
        $scope.ImWorkingOnItemQueue = 0;


        Queue.ImWorkingOnIt({}, function(data) {
            if (data.length > 0) {
                $scope.isShowButtonMoveToNext = data.length >= 2; 
                $scope.ListQueueInProcess = data;
                ShowWorkingProgressItem(data, 0);
            } else {
                $scope.notpendingTranslation= true;
            };
        });

        function ShowWorkingProgressItem(data, showItemDefault) {
            $scope.TranslateItem = data[showItemDefault];
            $scope.isParent = data[showItemDefault].IsParent;
            if (!$scope.TranslateItem.MenuDetail) {
                $scope.TranslateItem.MenuDetail = [];
            }
            $scope.getcssFlag = 'flag-icon-' + $scope.TranslateItem.LanguagesTo;
            $scope.selectedImage = $scope.TranslateItem.Menuid.files[0].url;
        }

        $scope.moveToNextItemInQueue = function(){
            if ($scope.ImWorkingOnItemQueue < ($scope.ListQueueInProcess.length -1 ) ) {
                $scope.ImWorkingOnItemQueue ++;
                ShowWorkingProgressItem($scope.ListQueueInProcess, $scope.ImWorkingOnItemQueue);
            }
        };

        $scope.moveToBackItemInQueue = function(){
            if ($scope.ImWorkingOnItemQueue >= 1 ) {
                $scope.ImWorkingOnItemQueue --;
                ShowWorkingProgressItem($scope.ListQueueInProcess, $scope.ImWorkingOnItemQueue);
            }
        };

        $scope.showMoveBack = function(){
            return $scope.ImWorkingOnItemQueue != 0;
        };

        $scope.showMoveNext = function(){
            return $scope.ImWorkingOnItemQueue != ($scope.ListQueueInProcess.length - 1 );
        };        


        $scope.getImage = function() {
            return selectedImage;
        };
        $scope.saveGroup = function(data, id) {
            Queue.SaveMenuAndItems({
                infomenuomenu: $scope.TranslateItem
            }, function success(data) {
                $scope.TranslateItem.MenuDetail = data.MenuDetail;
            }, function err(err) {
                console.log('error', err);
            });
        };

        $scope.removegroup = function(index) {
            $scope.TranslateItem.MenuDetail.splice(index, 1);
            Queue.SaveMenuAndItems({
                infomenuomenu: $scope.TranslateItem
            }, function success(data) {
                $scope.TranslateItem.MenuDetail = data.MenuDetail;
            }, function err(err) {
                console.log('error', err);
            });
        };

        $scope.showImage = function(data) {
            $scope.selectedImage = data.url;
        };

        $scope.addGroud = function() {

            var inserted = {
                NameGroupInMenu: '',
                PositionOrder: $scope.TranslateItem.MenuDetail.length
            };
            $scope.TranslateItem.MenuDetail.push(inserted);

            $scope.inserted = inserted;
        };


        $scope.goEditItem = function(index) {
            $state.go('translator.edit.item', {
                'index': index,
                'RowEditing':$scope.ImWorkingOnItemQueue
            });
        };

        $scope.FinnishedTranslation = function() {
            Queue.FinnishedTranslation({
                infomenuomenu: $scope.TranslateItem
            }, function(data) {
                $state.go('translator.list');
            });
        };
    });