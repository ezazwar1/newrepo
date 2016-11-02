angular.module('fun.controllers')
	.controller('MainController', function ($scope, $rootScope, LogServ, SessionServ) {

		var log = LogServ;

		log.info('MainController()');

		$scope.isAdmin = function () {
			return SessionServ.getUser().role === 'admin';
		};

		$rootScope.me = SessionServ.getUser();

		$scope.showLogPopup = function () {
			log.info('showLogPopup()');
			$rootScope.showLogPopup();
		};
	})
;
