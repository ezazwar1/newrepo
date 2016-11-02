/**
 * App Configuration
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.constant('appConfig', (function () {
		'use strict';

		var appConfig = {
			maxItemsPaging: 2
		}

		return appConfig;
	})());

})(window.angular);
