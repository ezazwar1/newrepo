angular.module('fun.controllers')
	.controller('AcceptTermsController', function (
		LogServ, $scope, MiscServ, $sce, StorageServ, ModalServ,
		$ionicPopup, gettextCatalog
	) {
		var log = LogServ,
			genre = $scope.data.genre,
			campaignName = genre && genre.config && genre.config.campaign && genre.config.campaign.title;

		if (campaignName) {
			$scope.campaignName = "- " + campaignName;
		} else {
			$scope.campaignName = "";
		}

		log.info('AcceptTermsController');

		log.info('genre: ', genre);

		$scope.htmlTerms = "";

		$scope.agree = function () {
			var termsAccepted = 
				$scope.data.acceptedGenreTerms &&
				$scope.data.acceptedStayfilmTerms
			;

			if (termsAccepted) {
				$scope.modal.hide();
				$scope.data.agreeCb();

			} else {
				$ionicPopup.alert({template: gettextCatalog.getString("Por favor, concorde com os termos apresentados antes de continuar."), title: gettextCatalog.getString("Você concorda?")});
			}
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

		// var key = 'terms-' + genre.config.campaignslug + '-' + genre.slug;

		// if ( ! StorageServ.has(key)) {
			
		// } else {
			
		// }

		$scope.showLegalTerms = function () {
			var modal = ModalServ.get('legal-terms');
			modal.show();
		};

		function openDynamicTerms (genre) {
			log.debug("openDynamicTerms(" + (genre && genre.slug) + ")", genre);

			var modal = ModalServ.get('dynamicTerms');

			modal.show({genre: genre, agreeCb: function () {
				$scope.data.genre = genre;
				$scope.goToTheme();
			}});
		}

		$scope.openDynamicTerms = openDynamicTerms;
	})
;
	
