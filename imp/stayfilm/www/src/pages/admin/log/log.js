angular.module('fun.controllers')
	.controller('AdminLogController', function ($scope, LogServ, ModalServ) {

		$scope.logList = LogServ.getRef();

		$scope.getItemHeight = function(item, index) {
			return (index % 2) === 0 ? 50 : 60;
		};

		$scope.showDetails = function (item) {
			var modal = ModalServ.get('info');
			modal.show(item);
		};
	})
;
