angular.module('fun.controllers')
	.controller('TermsController', function (
		$scope, $rootScope, LogServ, SessionServ, MiscServ
	) {

		var log = LogServ;

		log.info('TermsController()');

		$scope.localizedTerms = '<div class="pre-loader"><ion-spinner></ion-spinner></div>';

		MiscServ.getLocalizedTerms().then(
			function success(terms) {
				$scope.localizedTerms = terms;

			}, function fail() {
				$scope.localizedTerms = '';

			}
		);
	})
;
