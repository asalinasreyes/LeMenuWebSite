'use strict';

angular.module('leMeNuApp')
  .controller('WellcomeCtrl', ['$scope', '$state','User',function ($scope, $state,User) {
  	User.get({}, function(data){
  		if (data.role=='admin') {
  			$state.go(data.role);
  		}else if (data.role=='translator') {
  			$state.go(data.role);
  		}else{
  		  $state.go('owner');
  		}
  	});
  }]);
