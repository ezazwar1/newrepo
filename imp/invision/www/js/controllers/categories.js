/**
 * Categories controller
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.controller('CategoriesController', [
		'categoriesService',
		'$ionicLoading',
		function (categoriesSvc, $ionicLoading) {
			'use strict';

			var vm = this;

			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});

			categoriesSvc.getCategories()
				.then(setCategories)
				.finally(function(){
					$ionicLoading.hide();
				});

			function setCategories(categories) {
				vm.categories = categories;
			}

		}
	]);

})(window.angular);
