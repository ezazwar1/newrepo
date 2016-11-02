/**
 * Primary Menu controller
 */
(function(angular, undefined) {
angular
	.module('invisionApp')

	.controller('PrimaryMenuController', [
		'menusService',
		function (menusSvc) {
			'use strict';

			var vm = this;

			menusSvc.getMenuByLocation('primary')
				.then(setMenu);

			function setMenu(menu) {
				vm.menu = menu;
			}

		}
	]);

})(window.angular);
