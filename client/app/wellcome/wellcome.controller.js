'use strict';

angular.module('leMeNuApp')
  .controller('WellcomeCtrl', ['$scope', '$location','User',function ($scope, $location,User) {
  	User.get({}, function(data){
  		$location.path(data.role);
  	});
  }]);
