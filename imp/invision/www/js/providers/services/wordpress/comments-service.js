/**
 * Comments service
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.service('commentsService', [
		'$http',
		'routesConfig',
		'sharedObjects',
		function ($http, routesCfg, sharedObjects) {
			'use strict';

			function _prepCommentsData(data) {
				var preparedData = [];

				for (var index = 0, dLength = data.length; index < dLength; index++) {
					preparedData.push(_transformCommentsData(data[index]));
				}

				return preparedData;
			}

			function _transformCommentsData(data) {
				return {
					id: data.id,
					author: {
						name: data.author_name,
						avatar: data.author_avatar_urls['96']
					},
					date: data.date,
					description: data.content.rendered
				};
			}

			function getComments(params) {
				return $http.get(routesCfg.wpComments.all(sharedObjects.generateSearchParams(params)))
					.then(function(comments) {
						return _prepCommentsData(comments.data);
					});
			}

			return {
				getComments: getComments
			};
		}
	]);

})(window.angular);
