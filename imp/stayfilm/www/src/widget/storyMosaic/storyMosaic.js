angular.module('fun')
	.directive('sfStoryMosaic', function () {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'src/widget/storyMosaic/storyMosaic.html',
			scope: {
				story: "="
			}
		};
	})
;
