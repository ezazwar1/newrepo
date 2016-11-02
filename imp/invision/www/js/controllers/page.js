/**
 * Page controller
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.controller('PageController', [
		'$scope',
		'$stateParams',
		'pagesService',
		function ($scope, $stateParams, pagesSvc) {
			'use strict';

			var vm = this;

			pagesSvc.getPageById(parseInt($stateParams.pageId, 10))
				.then(setPage);

			function setPage(response) {
				vm.page = response;
			}

		}
	]);

})(window.angular);
