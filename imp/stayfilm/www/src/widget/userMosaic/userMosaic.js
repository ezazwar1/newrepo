angular.module('fun')
	.directive('sfUserMosaic', function () {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'src/widget/userMosaic/userMosaic.html',
			scope: {
				user: "="
			},
			controller: function ($scope, ProfileModal) {
				$scope.ProfileModal = ProfileModal;

			}
		};
	})
;
