'use strict'

angular.module('leMeNuApp')
 .controller('editTranslator', function($scope, myCache, ListAllow, User, toaster, $state, $timeout){
 	$scope.listPossibleLang = ListAllow.LanguagesAllow;
 	var userinfo = myCache.get("oneTranslator");
 	$scope.user = userinfo.userid;
 	$scope.user.languages =  userinfo.languages ;


        $scope.register = function(form) {
            $scope.submitted = true;
            if (form.$valid) {
                User.UpdateTranslate({
                	userid: $scope.user._id,
                	translateid: userinfo._id,
                    name: $scope.user.name,
                    email: $scope.user.email,
                    languages:$scope.user.languages
                }).$promise.then(function(data) {
                    showMessageSuccess();
                }).catch(function(err) {
                    ShowMessageError(err);
                });
            }
        };


        function ShowMessageError(err) {
            console.log(err);
            $scope.messageToaster = 'admin.newtranslator.msgError';
            toaster.pop({
                type: 'error',
                bodyOutputType: 'template',
                body: 'notification.html'
            });
        }

        function showMessageSuccess() {
            $scope.messageToaster = 'admin.edittranslator.msgSuccess';
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