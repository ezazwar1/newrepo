/**
 * Categories service
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.service('categoriesService', [
		'$http',
		'routesConfig',
		function ($http, routesCfg) {
			'use strict';

			function prepCategoriesData(data) {
				var preparedData = [];

				for (var index = 0, dLength = data.length; index < dLength; index++) {
					if (data[index].slug !== 'uncategorized') {
						preparedData.push(data[index]);
					}
				}

				return preparedData;
			}

			function getCategories() {
				return $http.get(routesCfg.wpCategories.all())
					.then(function(response) {
						return prepCategoriesData(response.data);
					});
			}

			function getCategory(catId) {
				return $http.get(routesCfg.wpCategories.single(catId))
					.then(function(response) {
						return response.data;
					});
			}

			return {
				getCategories: getCategories,
				getCategory: getCategory
			};
		}
	]);

})(window.angular);
