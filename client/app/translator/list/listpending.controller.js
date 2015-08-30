'use strict';

angular.module('leMeNuApp')
	.controller('QueueListCtrl', function($scope, $state, Queue, toaster) {

		$scope.messageToaster = '';



		Queue.query({}, function(data) {
			$scope.ListQueue = data;
		});

		Queue.ImWorkingOnIt( function(data){
			$scope.InProcess = data;
		});

		$scope.showInprocess = function(){
			var ExistInProcess = false;
			if ($scope.InProcess && $scope.InProcess.length==1 ) {
				ExistInProcess = true;
			};
			return ExistInProcess;
		};

		$scope.take = function(selected, index) {
			Queue.save(selected).$promise.then(function(data) {

				$scope.InProcess.push( data);
				$scope.ListQueue.splice(index, 1);
				ShowMessageOk();
			}).catch(function(err) {
				ShowMessageError();
			});
		};


		function ShowMessageError(err) {
			$scope.messageToaster = 'translator.list.yourareBusy';
			toaster.pop({
				type: 'error',
				bodyOutputType: 'template',
				body: 'notification.html'
			});
		}

		function ShowMessageOk(err) {
			$scope.messageToaster = 'translator.list.takesuccess';
			toaster.pop({
				type: 'success',
				bodyOutputType: 'template',
				body: 'notification.html'
			});
		}



	});