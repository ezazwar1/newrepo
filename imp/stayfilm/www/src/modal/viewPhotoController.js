angular.module('fun.controllers')
	.controller('viewPhotoController', function($scope, ModalServ, LogServ, $ionicPlatform, RoutingServ){
		var log = LogServ;

		log.info("viewPhotoController()", $scope.data.fileData);

		if ($scope.data.fileData.type === 'video') {
			$scope.movieUrl = $scope.data.fileData.uri;
			$scope.movieCover = $scope.data.fileData.image;
			console.log('>>>>>>> ', $scope.movieUrl);
			console.log('>>>>>>> ', $scope.movieCover);
		}

		// for android back button
		var deregisterFunc = $ionicPlatform.registerBackButtonAction(function () {
			log.debug('UploadMoviemakerController - back button callback');
			$scope.modal.hide();
			deregisterFunc();
		}, 101);

		RoutingServ.registerCb(function (toState) {
			log.debug('callback', toState);
			$scope.modal.hide();

			return false;
		});

		$scope.$on('$destroy', function () {
			log.debug('deregister');
			RoutingServ.deregisterCb();
		});
	})
;
