/**
 * Shared Objects service
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.service('sharedObjects', [
		function () {
			'use strict';

			function generateSearchParams(data) {
				var base = '';

				if (angular.isObject(data.filters) && !angular.equals(data.filters, {})) {
					var queryFilters = [];

					angular.forEach(data.filters, function (value, key) {
						queryFilters.push('filter[' + key + ']=' + value);
					});

					base += '?' + queryFilters.join('&');
				}

				if (angular.isObject(data.params) && !angular.equals(data.params, {})) {
					var queryParams = [],
						separator = base.length ? '&' : '?';

					angular.forEach(data.params, function (value, key) {
						queryParams.push(key + '=' + value);
					});

					base += separator + queryParams.join('&');
				}

				return base;
			}

			return {
				generateSearchParams: generateSearchParams
			};
		}
	]);

})(window.angular);
