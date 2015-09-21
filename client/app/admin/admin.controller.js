'use strict';

angular.module('leMeNuApp')
  .controller('AdminCtrl', function ($scope, $state) {
    $state.go('admin.users');
  });
