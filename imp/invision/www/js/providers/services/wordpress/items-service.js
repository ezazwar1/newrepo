/**
 * Items service
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.service('itemsService', [
		'$http',
		'routesConfig',
		'commonFactory',
		'sharedObjects',
		function ($http, routesCfg, common, sharedObjects) {
			'use strict';

			function _prepItemsData(data) {
				var preparedData = [];

				for (var index = 0, dLength = data.length; index < dLength; index++) {
					preparedData.push(_transformItemData(data[index]));
				}

				return preparedData;
			}

			function _transformItemData(data) {
				return {
					id: data.id,
					title: data.title.rendered,
					source: common.resolveObject('source', data.custom_fields, ''),
					featured: common.resolveObject('featured', data.custom_fields, false),
					date: data.date,
					img: common.resolveObject('source_url', data.better_featured_image, ''),
					description: data.content.rendered,
					category: data.categories[0],
					link: data.content.link
				};
			}

			function getItems(params) {
				return $http.get(routesCfg.wpItems.all(sharedObjects.generateSearchParams(params)))
					.then(function(items) {
						return _prepItemsData(items.data);
					});
			}

			function getItemById(itemId) {
				return $http.get(routesCfg.wpItems.single(itemId))
					.then(function(item) {
						return _transformItemData(item.data);
					});
			}

			return {
				getItems: getItems,
				getItemById: getItemById
			};
		}
	]);

})(window.angular);
