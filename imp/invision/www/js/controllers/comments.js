/**
 * Comments controller
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.controller('CommentsController', [
		'commentsService',
		'$stateParams',
		'$ionicLoading',
		function (commentsSvc, $stateParams, $ionicLoading) {
			'use strict';

			var vm = this;

			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});

			commentsSvc.getComments({
				'params': {'post': parseInt($stateParams.itemId, 10)}
			}).then(setComments)
				.finally(function(){
					$ionicLoading.hide();
				});

			function setComments(comments) {
				vm.comments = comments;
			}

		}
	]);

})(window.angular);
