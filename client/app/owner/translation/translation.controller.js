'use strict';

angular.module('leMeNuApp')
    .controller('translationCtrl', function($scope, TranslationOwner, $uibModal) {
        $scope.CreatedFiles = [];

        TranslationOwner.query({}, function(data) {
            $scope.ListTranslation = data;
        });

        $scope.download = function(restoInfo) {
            TranslationOwner.getFile(restoInfo,
                function success(data) {
                    SuccessDownload(data);
                },
                function err(err) {

                });
        };


        $scope.showOptionsEndTranslation = function(translate) {
            var showoption = false;
            if (translate.EndTranslate && translate.StartTranslate) {
                showoption = true;
            };
            return showoption;
        };

        $scope.ApprovedPublish = function(data) {
            data.OwnerApproved = true;
            TranslationOwner.ApprovedTranslation(data,
                function success(dataanwser) {
                    SuccessDownload(dataanwser);
                },
                function err(err) {

                });
        };


        $scope.showComplaint = function(complaint) {
            var modalInstance = $uibModal.open({
                templateUrl: 'OwnerViewcomplaint.html',
                controller: 'ModalInstanceMOwnerComplaintCtrl',
                resolve: {
                    complaintDetail: function() {
                        return complaint;
                    }
                }
            });
        };



        $scope.getTypeComplaint = function(complaint) {
            var nameClass = 'btn-warning';
            if (complaint.Status == 'open') {
                nameClass = 'btn-danger';
            }else if (complaint.Status == 'close') {
                nameClass = 'btn-success';
            }
            return nameClass;
        };

        $scope.UnApprovedPublish = function(data) {
            data.OwnerApproved = false;
            TranslationOwner.ApprovedTranslation(data,
                function success(dataanwser) {

                },
                function err(err) {

                });
        };


        function SuccessDownload(data) {
            var inforesult = {
                id: data._id,
                language: data.LanguagesTo,
                fullpath: data.fullpath,
                filename: data.name
            };
            $scope.CreatedFiles.push(inforesult);
        };

        $scope.isFileCreated = function(row) {
            var filesExists = _.where($scope.CreatedFiles, {
                id: row._id,
                language: row.LanguagesTo
            });
            return filesExists.length > 0;
        };

        $scope.viewTranslation = function(restoInfo) {
            var queryParams = {
                queuedID: restoInfo._id,
                Restaurantid: restoInfo.Restaurantid._id,
                LanguagesTo: restoInfo.LanguagesTo
            };



            TranslationOwner.viewTranslation(queryParams,
                function success(data) {
                    $scope.viewMenu = data;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'viewMenu.html',
                        controller: 'ModalInstanceViewMenuCtrl',
                        resolve: {
                            items: function() {
                                return data;
                            },
                            language: function() {
                                return restoInfo.LanguagesTo;
                            }
                        }
                    });
                },
                function err(err) {});
        };

        $scope.getFilePath = function(row) {
            var filename = '';
            if (row._id) {
                var filesExists = _.where($scope.CreatedFiles, {
                    id: row._id,
                    language: row.LanguagesTo
                });
                if (filesExists.length > 0) {
                    filename = filesExists[0].fullpath;
                }
            }
            return filename;
        };


        $scope.openNewComplaint = function(translationComplaint) {
            $scope.informationComplaint = translationComplaint;
            var modalInstance = $uibModal.open({
                templateUrl: 'Addcomplaint.html',
                controller: 'ModalInstanceAddComplaintCtrl',
                size: '',
                resolve: {
                    descripcionComplaint: function() {
                        return $scope.descripcionComplaint;
                    }
                }
            });
            modalInstance.result.then(function(complaintText) {
                var complaintInformation = {
                    queuedID: $scope.informationComplaint._id,
                    Restaurantid: $scope.informationComplaint.Restaurantid._id,
                    LanguagesTo: $scope.informationComplaint.LanguagesTo,
                    Complaint: complaintText,
                    OwnerApproved: false
                };

                TranslationOwner.AddComplaint(complaintInformation,
                    function success(data) {
                        $scope.resultComplaint = data;
                        TranslationOwner.query({}, function(data2) {
                            $scope.ListTranslation = data2;
                        });
                    },
                    function err(err) {

                    });

            }, function() {
                $scope.descripcionComplaint = '';
            });
        };
    })
    .controller('ModalInstanceViewMenuCtrl', function($scope, $uibModalInstance, items, language) {
        $scope.viewMenu = items;

        $scope.language = language;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    })
    .controller('ModalInstanceAddComplaintCtrl', function($scope, $uibModalInstance) {

        $scope.ok = function() {
            $uibModalInstance.close($scope.descripcionComplaint);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.enableButtonOK = function() {
            var isEnable = false;

            if ($scope.descripcionComplaint) {
                if ($scope.descripcionComplaint.length > 0) {
                    isEnable = true;
                }
            }
            return isEnable;
        }
    })
    .controller('ModalInstanceMOwnerComplaintCtrl', function($scope, $uibModalInstance, complaintDetail) {

        $scope.complaint = complaintDetail;

        $scope.descripcionComplaint = complaintDetail.DescriptionComplaint;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
