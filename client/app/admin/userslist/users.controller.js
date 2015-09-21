'use strict';

angular.module('leMeNuApp')
  .controller('AdminUsersListCtrl', function ($scope, $http, $state, Auth, User, myCache) {
    $scope.users = User.query();
    

    $scope.addTranslator = function(){

      $state.go('admin.newtrad');
    };

    $scope.goEdit = function(selected){
      myCache.set("oneTranslator", selected);
      $state.go('admin.edittra', {translator:selected._id});
    }

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
