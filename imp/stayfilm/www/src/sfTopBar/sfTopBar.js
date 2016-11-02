angular.module('fun')
	.directive('sfTopBar', function (SessionServ, $state, $ionicSideMenuDelegate) {

		return {
			restrict: 'E',
			replace: true,
			scope: true,
			transclude: true,
			controller: function ($scope) {
				$scope.toggleSideMenu = function() {
					$ionicSideMenuDelegate.toggleLeft();
				};
			},
			templateUrl: 'src/sfTopBar/sfTopBar.html'
		};
	})
;
