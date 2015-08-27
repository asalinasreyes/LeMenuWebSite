'use strict';

angular.module('leMeNuApp')
  .controller('WellcomeCtrl', ['$scope', '$location','User',function ($scope, $location,User) {
  	User.get({}, function(data){
  		if (data.role=='owner') {
  			$location.path(data.role+'/resto/list');
  		}else{
  		$location.path(data.role);	
  		}
  	});
  }]);
