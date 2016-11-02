angular.module('fun.controllers')
	.controller('ThemeMoviemakerController', function (
		LogServ, $scope, ConfigServ, UploadMediaServ, SessionServ,
		MovieServ, $ionicPopup, $state, MoviemakerServ, MiscServ, StorageServ, gettextCatalog
	) {
		var log = LogServ;
		log.info('ThemeMoviemakerController');

		$scope.data = MoviemakerServ.getDataReference();

		log.info('data', $scope.data);

		var data = $scope.data;

		$scope.themes = ConfigServ.getMisc('themes');

		var allContentTheme = ConfigServ.getMisc('themes').filter(function (theme) {
			return theme.idtheme === 7;
		})[0];

		var allContentSubtheme = allContentTheme.subthemes.filter(function (subtheme) {
			return subtheme.idsubtheme === 40;
		})[0];

		$scope.selectTheme = function(theme, subtheme) {
			log.info("THEME: " + theme.name + ", " + subtheme.name);
			$scope.data.theme = theme;
			$scope.data.subtheme = subtheme;
			$scope.data.allContentSelected = false;
		};

		$scope.data.allContentSelected = $scope.data.allContentSelected || false;

		$scope.allContent = function () {
			if ($scope.data.allContentSelected) {
				$scope.data.allContentSelected = false;
				$scope.data.theme = null;
				$scope.data.subtheme = null;

			} else {
				$scope.data.theme = allContentTheme;
				$scope.data.subtheme = allContentSubtheme;
				$scope.data.allContentSelected = true;
			}
		};

		if ($scope.data.subtheme) {
			$scope.subthemeVisible = true;
		}

		$scope.lang = SessionServ.getLang();

		$scope.dontDoVideo = function() {
			log.debug("*DONT*DoVideo() ...");

			$scope.goTo('main.waiting', {
				idjob: null
			});
		};

		$scope.refine = function () {

			var params = MoviemakerServ.getPreparedParams(data);
			params.idalbum = null;

			_.remove(params.networks, function(network) {
				return network === 'sf_upload';
			});

			$scope.goTo('main.albummanager.contentzone', null, {data: JSON.stringify(params)});
		};

		$scope.makeIt = function() {
			log.info("makeIt()");

			MiscServ.showLoading();

			if ( ! $scope.data.theme && ! $scope.data.subtheme) {
				MiscServ.hideLoading();
				
				$ionicPopup.alert({
					title: gettextCatalog.getString('Quase pronto...'),
					template: gettextCatalog.getString("Por favor, selecione um tema ou escolha 'Todo meu conteúdo'.")
				});

				return;
			}

			if ( ! data.idalbum) {

				var hasSelectedSn = false;

				angular.forEach(data.selectedNetworks, function (val) { // (val, sn)
					if (val) {
						hasSelectedSn = true;
					}
				});


				if ( ! hasSelectedSn &&  UploadMediaServ.getCount() < ConfigServ.get('min_mini_template_photo')) {
					MiscServ.hideLoading();

					log.debug(UploadMediaServ.getCount('UPLOADED') + " medias uploaded");

					$ionicPopup.alert({
						title: gettextCatalog.getString('Onde estão suas fotos ?'),
						template: gettextCatalog.getString('Por favor, selecione uma rede social ou escolha pelo menos {{num}} fotos de seu aparelho.').replace('{{num}}', ConfigServ.get('min_mini_template_photo'))
					});

					return;
				}
			}

			// flag to tell the waiting step to go ahead.
			StorageServ.set('do_video_allowed', true, 'memory');

			$scope.goTo('main.waiting', null, {source: 'moviemaker', location: 'replace'});

			MiscServ.hideLoading();
		};
	});
