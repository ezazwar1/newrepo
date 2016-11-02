/**
 * Items controller
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.controller('CategoryController', [
		'$q',
		'$stateParams',
		'itemsService',
		'categoriesService',
		'$scope',
		'appConfig',
		function ($q, $stateParams, itemsSvc, categoriesSvc, $scope, appConfig) {
			'use strict';

			var vm = this,
				noMoreItemsAvailable = false;


			vm.items = [];
			vm.loadData = loadData;

			function loadData() {
				itemsSvc.getItems({
					'filters': {'cat': parseInt($stateParams.categoryId, 10)},
					'params': {'offset': vm.items.length, 'per_page': appConfig.maxItemsPaging}
				}).then(setItems);
			}

			categoriesSvc.getCategory(parseInt($stateParams.categoryId, 10)).then(setCategory);

			function setCategory(response) {
				vm.category = response;
			}

			function setItems(response) {
				if (response.length === 0) {
					vm.noMoreItemsAvailable = true;
				} else {
					vm.items = vm.items.concat(response);
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		}
	]);

})(window.angular);
