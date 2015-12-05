'use strict';

angular.module('leMeNuApp')
    .controller('AdminListMenusCtrl', function($scope, $translate, ListAllow,  DashBoardInfo, $stateParams,$state ) {
    	var idResto = $stateParams.restaurant;

    	DashBoardInfo.MenusByIDResto({idResto:idResto}, function(listmenu){
    			$scope.listMenu = listmenu.ListMenu;
    			$scope.ListTranslation = listmenu.ListQueue;
    			$scope.ListComplaint = listmenu.ListComplaint;
    			$scope.Restaurant = listmenu.InfoResto;
    	});
    });