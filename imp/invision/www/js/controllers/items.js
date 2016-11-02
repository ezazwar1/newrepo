/**
 * Items controller
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.controller('ItemsController', [
		'$q',
		'$stateParams',
		'itemsService',
		'categoriesService',
		'commentsService',
		'$ionicLoading',
		'sharedObjects',
		function ($q, $stateParams, itemsSvc, categoriesSvc, commentsSvc, $ionicLoading, sharedObjects) {
			'use strict';

			var vm = this;

			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});


			itemsSvc.getItemById(parseInt($stateParams.itemId, 10))
				.then(setItems)
				.then(getCategory)
				.then(setCategory)
				.then(setShare)
				.finally(function(){
					$ionicLoading.hide();
				});

			function setItems(response) {
				vm.item = response;
				return response;
			}

			function getCategory(response) {
				return categoriesSvc.getCategory(response.category)
			}

			function setCategory(response) {
				vm.category = response;
			}

			function setShare() {
				vm.share = {
					'networks': ['facebook', 'twitter', 'whatsapp', 'anywhere', 'sms', 'email'],
					'message': vm.item.title,
					'subject': vm.category.name,
					'file': vm.item.img,
					'link': vm.item.link,
					'toArr': ['info@surfit.mobi'],
					'bccArr': [],
					'ccArr': [],
					'phone': '098765432'
				};
			}

		}
	]);

})(window.angular);
