'use strict';

angular.module('leMeNuApp')
    .controller('AdminNewTrandCtrl', function($scope, User, $state, toaster, $filter, $timeout, ListAllow) {
        $scope.user = {};
        $scope.errors = {};
        $scope.messageToaster = '';

        $scope.listPossibleLang = ListAllow.LanguagesAllow;

        $scope.register = function(form) {
            $scope.submitted = true;
            if (form.$valid) {
                User.saveTranslate({
                    name: $scope.user.name,
                    email: $scope.user.email,
                    password: $scope.user.password,
                    languages:$scope.user.languages
                }).$promise.then(function(data) {

                    showMessageSuccess();
                }).catch(function(err) {
                    ShowMessageError(err);
                });
            }
        };



        function ShowMessageError(err) {
            $scope.messageToaster = 'admin.newtranslator.msgError';
            toaster.pop({
                type: 'error',
                bodyOutputType: 'template',
                body: 'notification.html'
            });
            err = err.data;
            $scope.errors = {};
            angular.forEach(err.errors, function(error, field) {
                form[field].$setValidity('mongoose', false);
                $scope.errors[field] = error.message;
            });
        }

        function showMessageSuccess() {
            $scope.messageToaster = 'admin.newtranslator.msgSuccess';
            toaster.pop({
                type: 'info',
                bodyOutputType: 'template',
                body: 'notification.html'
            });
            $timeout(function() {
                $state.go('admin.users');
            }, 2000);
        };
    });
