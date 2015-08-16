'use strict';

angular.module('leMeNuApp')

.controller('MyRestaurantOwnerNewMenuCtrl', function($scope, $state, Upload, RestaurantMenu, mySharedService) {
    $scope.cartMenu = {};
    $scope.progressUpload = '';
    $scope.listNamePhotoUpload = [];
    $scope.listFilesPhotoUpload = [];
    $scope.isUploading = false;


    $scope.cartMenu.namemenu = '';
    $scope.cartMenu.language = [];


    $scope.showRequiredLanguages = function() {
        var styperesult = true;
        if ($scope.cartMenu.hasOwnProperty('language')) {
            if ($scope.cartMenu.language.hasOwnProperty('length')) {
                styperesult= $scope.cartMenu.language.length == 0;
            };
        }
        return styperesult;
    };

    $scope.SaveNewRestaurantMenu = function() {
        $scope.cartMenu.restaurantid = mySharedService.message._id;
        $scope.cartMenu.files = $scope.listFilesPhotoUpload;
        RestaurantMenu.save($scope.cartMenu, function(info) {
            $scope.cartMenu = {};
            $state.go('owner.mymenu.listmenu', {}, {
                reload: true
            });
        });
    };

    $scope.uploadFileToServe = function(files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/api/photomenus',
                    fields: {
                        'username': $scope.username
                    },
                    file: file
                }).progress(function(evt) {
                    var filename = evt.config.file.name;
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.isUploading = true;
                    if ($scope.listNamePhotoUpload.indexOf(filename) == -1) {
                        $scope.listNamePhotoUpload.push(filename);
                    };
                }).success(function(data, status, headers, config) {
                    $scope.progressPercentage='';
                    console.log('termine de subir info ', data);
                    if (status == 200) {
                        $scope.isUploading = false;
                        $scope.listFilesPhotoUpload.push(data);

                    }else{

                    }
                }).error(function() {

                });
            }
        }
    };


    $scope.isEnableButtonSave = function() {
        var statusButtonSave = true;
        if (!$scope.cartMenu.$invalid) {
            if ($scope.listNamePhotoUpload.length > 0) {
                statusButtonSave = false;
            }
        }
        return statusButtonSave;
    };

    $scope.back = function() {
        $state.go('owner.mymenu.listmenu', {}, {
            reload: true
        });
    };
});
