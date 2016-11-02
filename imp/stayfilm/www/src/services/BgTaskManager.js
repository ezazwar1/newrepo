angular.module('fun.services')
	.factory('BgTaskManager', function () {

		var queue = [];

		return {
			add: function (func) {
				queue.push(func);
			}
		};
	})
;
