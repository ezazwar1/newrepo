angular.module('fun.controllers')
	.controller('LoadingController', function ($scope, LogServ, MiscServ) {	

		$scope.close = function () {
			MiscServ.hideLoading();
		};
	})
;
