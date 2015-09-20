'use strict';

angular.module('leMeNuApp')
    .controller('TranslatorEditCtrl', function($scope, Queue, $filter, $http, $state) {
        $scope.editingItem = false;

        Queue.ImWorkingOnIt({}, function(data) {
            $scope.TranslateItem = data[0];
            if (!$scope.TranslateItem.MenuDetail) {
            $scope.TranslateItem.MenuDetail =[];    
            };
            
            $scope.selectedImage = $scope.TranslateItem.Menuid.files[0].url;
            console.log('data menu en traduccion', data);
        });


        $scope.getImage = function(){
            return selectedImage;
        };
        $scope.saveGroup = function(data, id) {
            Queue.SaveMenuAndItems({infomenuomenu:$scope.TranslateItem}, function( data){
                $scope.TranslateItem.MenuDetail = data.MenuDetail;
            });
        };

        $scope.removegroup = function(index) {
            $scope.TranslateItem.MenuDetail.splice(index, 1);
            Queue.SaveMenuAndItems({infomenuomenu:$scope.TranslateItem}, function( data){
                $scope.TranslateItem.MenuDetail = data.MenuDetail;
            });
        };

        $scope.showImage =function(data){
            $scope.selectedImage = data.url;
        };

        $scope.addGroud = function() {
            $scope.inserted = {
                NameGroupInMenu: '',
                PositionOrder: $scope.TranslateItem.MenuDetail.length
            };
            $scope.TranslateItem.MenuDetail.push($scope.inserted);
        };


        $scope.goEditItem = function(index){
            $state.go('translator.edit.item', {'index':index});
        };

        $scope.FinnishedTranslation = function(){
            Queue.FinnishedTranslation({infomenuomenu:$scope.TranslateItem}, function( data){
               console.log('termine');
               console.log(data);
            });
        };
    });
