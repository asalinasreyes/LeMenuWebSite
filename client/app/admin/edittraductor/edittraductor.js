'use strict'

angular.module('leMeNuApp')
 .config(function($stateProvider){
 	$stateProvider
            .state('admin.edittra', {
                url: '/edit/:translator',
                templateUrl: 'app/admin/edittraductor/edittraductor.html',
                controller: 'editTranslator'
            });
 });