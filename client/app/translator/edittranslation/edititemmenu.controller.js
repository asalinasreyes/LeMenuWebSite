'use strict';

angular.module('leMeNuApp')
    .controller('TranslatorEditItemMenuCtrl', function($scope, $window, Queue, $stateParams, $modal) {
    	var modalInstance =null;
        Queue.ImWorkingOnIt({}, function(data) {
            $scope.TranslateItem = data[0];

            $scope.workingOver  =  $scope.TranslateItem.MenuDetail[$stateParams.index];
            if (!$scope.workingOver.ItemsInMenu) {
                $scope.workingOver.ItemsInMenu = [];
            };

        });

        $scope.goBack = function() {
            $window.history.back();
        };


        $scope.saveItemMenu = function(data, id) {
            Queue.SaveMenuAndItems({infomenuomenu:$scope.TranslateItem}, function(data){
                $scope.workingOver = data.MenuDetail[$stateParams.index];;
            });
        };

        $scope.removeItemMenu = function(index) {
        	showProcessing();
            $scope.workingOver.ItemsInMenu.splice(index, 1);
            Queue.SaveMenuAndItems({infomenuomenu:$scope.TranslateItem}, function( data){
                $scope.TranslateItem.MenuDetail = data.MenuDetail;
                modalInstance.close();
            });
        };

        $scope.addItemInGroud = function() {
            $scope.inserted = {
                Namedescription: '',
                DescriptionItemMenu:'',
                DescriptionItemsItemMenu:'',
                PriceItemsItemMenu:'',
                PositionOrder: $scope.TranslateItem.MenuDetail.length
            };
            $scope.workingOver.ItemsInMenu.push($scope.inserted);
        };

        function showProcessing(){
        	 modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    backdrop: 'static'
                });
        }

    });
