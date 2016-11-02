angular.module('fun.controllers')
	.controller('StartController', function ($scope, $state, $timeout, $ionicGesture, SessionServ, LogServ, $interval, $ionicScrollDelegate, MiscServ) {
		var log = LogServ;
		log.info('StartController');

		$scope.goToLogin = function () {
			MiscServ.goTo('welcome.login');
		};

		$scope.goToRegister = function () {
			MiscServ.goTo('welcome.register');
		};

		if (SessionServ.isLogged()) {
			$scope.goTo('main.home.feed');
			return;
		}

		var backart = $(".back-art");
		var contents = $(".contents");
		var delegate = $ionicScrollDelegate.$getByHandle('welcomeHandle');

		$scope.parallaxScroll = function () {
			backart[0].style.backgroundPosition = -(delegate.getScrollPosition().left * 0.5) + "px 0";
		};

		// var snapToFrame = function () {
		// 	var fullWidth = contents.width();
		// 	var frameWidth = ~~(fullWidth / 4);
		// 	var frameLimits = ~~(frameWidth / 2);
			
		// 	var pos = delegate.getScrollPosition();

		// 	var posLeft;
		// 	if (pos) {
		// 		posLeft = ~~(pos.left);

		// 		var begin1 = frameWidth * 0;
		// 		var end1 = frameWidth * 1 - (frameLimits);
		// 		if (posLeft >= begin1 && posLeft < end1) {
		// 			delegate.scrollTo(frameWidth * 0, 0, true);
		// 		}

		// 		var begin2 = end1;
		// 		var end2 = end1 + frameWidth;
		// 		if (posLeft >= begin2 && posLeft < end2) {
		// 			delegate.scrollTo(frameWidth * 1, 0, true);
		// 		}

		// 		var begin3 = end2;
		// 		var end3 = end2 + frameWidth;
		// 		if (posLeft >= begin3 && posLeft < end3) {
		// 			delegate.scrollTo(frameWidth * 2, 0, true);
		// 		}

		// 		var begin4 = end3;
		// 		if (posLeft >= begin4) {
		// 			delegate.scrollTo(frameWidth * 3, 0, true);
		// 		}
		// 	}
		// };

		// $ionicGesture.on('release', function () {
		// 	snapToFrame();
		// }, $('.container'));
	})
;
