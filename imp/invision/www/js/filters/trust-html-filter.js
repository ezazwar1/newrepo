/**
 * trustHtml filter
 */	
(function(angular, undefined) {
angular
	.module('invisionApp')

	.filter('trustHtml', [
		'$sce',
		function ($sce) {
			'use strict';

			return function (input) {
				return $sce.trustAsHtml(input);
			};
		}
	]);
})(window.angular);
