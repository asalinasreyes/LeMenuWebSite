'use strict';

angular.module('leMeNuApp')

.controller('MyRestaurantOwnerEditMenuCtrl', function($scope, $state, $modal, $translate, Upload, myCache, ListAllow, RestaurantMenu) {

    $scope.RestaurantSelectedInfo = myCache.get("oneresto");
    $scope.progressUpload = '';
    $scope.listFilesPhotoUpload = [];
    $scope.isUploading = false;
    $scope.disabledAll = false;

    $scope.RestaurantSelectedInfo = $scope.RestaurantSelectedInfo;
    $scope.cartMenuSelected = $scope.RestaurantSelectedInfo.ItemMenuSelected;
    
    if ($scope.cartMenuSelected.hasOwnProperty('status') && $scope.cartMenuSelected.status=='success') {
        $scope.disabledAll = true;
        $scope.isUploading = true;
    };

    $scope.listFilesPhotoUpload = $scope.RestaurantSelectedInfo.ItemMenuSelected.files;


    $scope.listPossibleLang = ListAllow.LanguagesAllow;
    var languageEnabled = $scope.RestaurantSelectedInfo.language;

    $scope.disableLang = function(oneOption){
        return oneOption.locale == languageEnabled ;
    };

    $scope.showRequiredLanguages = function() {
        if (!$scope.cartMenuSelected.hasOwnProperty('language')) {
            return true;
        }
        return $scope.cartMenuSelected.language.length == 0;
    };

    $scope.SaveNewRestaurantMenu = function() {
        $scope.cartMenuSelected.Restaurantid = $scope.RestaurantSelectedInfo._id;
        $scope.cartMenuSelected.files = $scope.listFilesPhotoUpload;
        RestaurantMenu.PUT($scope.cartMenuSelected, function(info) {
            $scope.cartMenuSelected = {};
            $state.go('owner.resto.list', {}, {
                reload: true
            });
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
        if (!$scope.cartMenuSelected.$invalid) {
            if (!$scope.isUploading) {
                statusButtonSave = false;
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