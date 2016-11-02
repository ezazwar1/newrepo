angular.module('fun.controllers')
	.controller('PrivacyController', function (
		$scope, $rootScope, LogServ, SessionServ, MiscServ
	) {

		var log = LogServ;

		log.info('PrivacyController()');

		$scope.localizedTerms = '<div class="pre-loader"><ion-spinner></ion-spinner></div>';

		MiscServ.getLocalizedPrivacyTerms().then(
			function success(terms) {
				$scope.localizedTerms = terms;

			}, function fail() {
				$scope.localizedTerms = '';
				
			}
		);
	})
;
