angular.module('fun.controllers')
	.controller('MaintenanceController', function ($scope, LogServ, MaintenanceServ) {
		var log = LogServ;

		log.info("MaintenanceController()");

		$scope.message = MaintenanceServ.getMessage();

	})
;
