/**
 * Common factory
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.factory('commonFactory', [
		function () {
			'use strict';


			function resolveObject(key, resObject, defaultValue) {
				if (!angular.isString(key) || !angular.isObject(resObject)) {
					return angular.isDefined(defaultValue) ? defaultValue : null;
				}

			  var result = resObject,
				curKey = null,
				keyParts = key.split('.');

				while (keyParts.length) {
					curKey = keyParts.shift();
					if (result && angular.isDefined(result[curKey])) {
						result = result[curKey];
					} else {
						return defaultValue;
					}
				}

				return result;
			}


			return {
				resolveObject: resolveObject
			};
		}
	]);

})(window.angular);
