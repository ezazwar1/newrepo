angular.module('fun.controllers')
	.controller('DynamicTermsController', function (
		LogServ, $scope, MiscServ, $sce, StorageServ, gettextCatalog
	) {
		var log = LogServ,
			genre = $scope.data.genre;

		log.info('DynamicTermsController');

		log.info('genre: ', genre);

		$scope.htmlTerms = "";

		$scope.agree = function () {
			$scope.modal.hide();
			$scope.data.agreeCb();
		};

		if ( ! genre) {
			throw new Error("No genre to get terms");
		}

		if ( ! genre.config || ! genre.config.campaignslug) {
			throw new Error("No CAMPAIGN SLUG to get terms");
		}

		if ( ! genre.slug) {
			throw new Error("No GENRE SLUG to get terms");
		}


		// TEMPORARILY DISABLED CACHE >>>

		// var key = 'terms-' + genre.config.campaignslug + '-' + genre.slug;

		// if ( ! StorageServ.has(key)) {
			MiscServ
				.getGenreTerms(genre.config.campaignslug, genre.slug)
				.then(
					function success(resp) {
						log.debug("Misc.getGenreTerms()::SUCCESS");

						$scope.htmlTerms = $sce.trustAsHtml(resp.terms);

		//				StorageServ.set(key, resp.terms, null, 3600 * 24);
					},
					function fail () {
						log.debug("Misc.getGenreTerms()::FAIL");
						$scope.htmlTerms = gettextCatalog.getString('Não foi possível carregar os termos.');
					}
				)
			;
		// } else {
		// 	log.debug("Misc.getGenreTerms()::CACHE");
		// 	$scope.htmlTerms = $sce.trustAsHtml(StorageServ.get(key));
		// }
		
		// <<< TEMPORARILY DISABLED CACHE
	})
;
	
