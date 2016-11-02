angular.module('ionic.metApp')

.controller('aboutCtrl', ['$cordovaAppVersion', '$scope', '$ionicPlatform',
	function($cordovaAppVersion, $scope, $ionicPlatform) {
		$ionicPlatform.ready(function() {
			if (window.cordova) {
				$cordovaAppVersion.getVersionNumber().then(function(version) {
					$scope.appVersion = version;
				});
			}
		})
	}
])
