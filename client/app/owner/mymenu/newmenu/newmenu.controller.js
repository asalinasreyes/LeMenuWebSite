'use strict';

angular.module('leMeNuApp')

.controller('MyRestaurantOwnerNewMenuCtrl', function($scope, $state, $modal, $filter , $translate, Upload, RestaurantMenu, myCache, ListAllow) {
    $scope.cartMenu = {namemenu:'', language :[] };
    $scope.progressUpload = '';
    $scope.listFilesPhotoUpload = [];
    $scope.isUploading = false;

    $scope.RestaurantSelectedInfo = myCache.get("oneresto");
    var languageEnabled = $scope.RestaurantSelectedInfo.language;
    
    $scope.listPossibleLang  =ListAllow.LanguagesAllow;

    $scope.showRequiredLanguages = function() {

        if (!$scope.cartMenu.hasOwnProperty('language')) {
            return true;
        }
       return $scope.cartMenu.language.length ==0 ;
    };


    $scope.disableLang = function(oneOption){
        return oneOption.locale == languageEnabled ;
    };

    $scope.SaveNewRestaurantMenu = function() {
        $scope.cartMenu.Restaurantid = $scope.RestaurantSelectedInfo._id;
        $scope.cartMenu.files = $scope.listFilesPhotoUpload;
        RestaurantMenu.save($scope.cartMenu, function(info) {
            $scope.cartMenu = {};
            if (!$scope.RestaurantSelectedInfo.ListMenu) {
                    $scope.RestaurantSelectedInfo.ListMenu=[];
            };
            $scope.RestaurantSelectedInfo.ListMenu.push(info);
            myCache.set("oneresto", $scope.RestaurantSelectedInfo);
            $state.go('owner.mymenu.listmenu');
        });
    };

    $scope.uploadFileToServe = function(files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    backdrop: 'static'
                });
                Upload.upload({
                    url: '/api/photomenus',
                    file: file
                }).progress(function(evt) {
                    var filename = evt.config.file.name;
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.isUploading = true;
                }).success(function(data, status, headers, config) {
                    $scope.progressPercentage = '';
                    modalInstance.close();
                    if (status == 200) {
                        $scope.isUploading = false;
                        $scope.listFilesPhotoUpload.push(data);

                    } else {

                    }
                }).error(function() {

                });
            }
        }
    };

    $scope.isEnableButtonSave = function() {
        var statusButtonSave = true;
        if (!$scope.cartMenu.$invalid) {
            if (!$scope.isUploading) {
                if ($scope.listFilesPhotoUpload.length > 0) {
                    statusButtonSave = false;
                };
            };
        }
        return statusButtonSave;
    };

    $scope.back = function() {
        $state.go('owner.mymenu.listmenu', {}, {
            reload: true
        });
    };
});