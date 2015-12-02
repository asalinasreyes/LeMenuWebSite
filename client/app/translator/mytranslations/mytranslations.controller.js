'use strict';

angular.module('leMeNuApp')
    .controller('TranslatorMyListTranslationsCtrl', function($scope, $state, Queue, $uibModal) {

        $scope.RefreshList = function() {
            Queue.GetListTranslationDone({},
                function success(data) {
                    $scope.listTranslations = data;
                },
                function err(err) {

                });
        };
        $scope.RefreshList();

        $scope.showComplaint = function(complaint) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Changecomplaint.html',
                controller: 'ModalInstanceMyComplaintCtrl',
                resolve: {
                    complaintDetail: function() {
                        return complaint;
                    }
                }
            });

            modalInstance.result.then(function(resultOption) {
                if (resultOption == 'start') {
                    Queue.StartFixComplaint({
                        queue_id: complaint.QueueTranslationID,
                        complaint_id: complaint._id
                    }, function(data) {
                        $state.go('translator.edit');
                    });
                } else if (resultOption == 'done') {
                    Queue.CloseComplaint({
                        complaint_id: complaint._id
                    }, function(data) {
                        $scope.RefreshList();
                    });
                }
            }, function() {
                console.log('otro camino');
            });
        };

        $scope.getTypeComplaint = function(complaint) {
            var nameClass = 'btn-warning';
            if (complaint.Status == 'open') {
                nameClass = 'btn-danger';
            }
            return nameClass;
        };
    })
    .controller('ModalInstanceMyComplaintCtrl', function($scope, Queue, $uibModalInstance, complaintDetail) {

        $scope.complaint = complaintDetail;

        $scope.descripcionComplaint = complaintDetail.DescriptionComplaint;

        $scope.showStartComplaint = function() {
            return $scope.complaint.Status == 'open';
        };

        $scope.showCloseComplaint = function() {
            return $scope.complaint.Status == 'done';
        };

        $scope.startFixComplaint = function() {
            $uibModalInstance.close('start');
        };

        $scope.CloseComplaint = function() {
            $uibModalInstance.close('done');
        };


        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
