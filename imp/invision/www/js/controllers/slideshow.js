/**
 * Slideshow controller
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.controller('SlideshowController', [
		'$ionicHistory',
		'$window',
		'$state',
		'$scope',
		'$ionicPlatform',
		function ($ionicHistory, $window, $state, $scope, $ionicPlatform) {
			'use strict';

			var vm = this;

			vm.skipIntro = skipIntro;
			$ionicPlatform.ready(onIonicReady);

			function skipIntro() {
				$window.localStorage.setItem('showIntro', false);
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('app.categories', {}, {location: "replace", reload: true});
			}

			function onIonicReady() {
				if ($window.localStorage.getItem('showIntro') !== 'true' && $state.params.forceShow === 'false') {
					skipIntro();
				} else if ($state.params.forceShow === 'false') {
					$scope.$emit('hideMenu', true);
				}
			}
		}
	]);

})(window.angular);
