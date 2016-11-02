angular.module('fun.controllers')
	.controller('GenreMoviemakerController', function (
		LogServ, $scope, ConfigServ, StorageServ, $ionicPopup,
		$stateParams, MoviemakerServ, ModalServ, UploadMediaServ,
		gettextCatalog
	) {
		var log = LogServ;

		log.info('GenreMoviemakerController');

		log.info(StorageServ.get('moviemaker'));

		$scope.data = MoviemakerServ.getDataReference();

		if ($stateParams.idalbum) {
			$scope.data.idalbum = $stateParams.idalbum;
		}

		$scope.genres = orderByHasMiniTemplate(ConfigServ.get('fun_moviemaker_genre_list'));

		function orderByHasMiniTemplate(arr) {
			var templateList = arr.slice(0);
			var hasMiniTemplate = [];
			var noMiniTemplate = [];

			for (var i = 0; i < arr.length; i++) {
				if (arr[i].config.has_mini_templates !== 1) {
					noMiniTemplate.push(arr[i]);
				} else {
					hasMiniTemplate.push(arr[i]);
				}
			}

			templateList = []; // gc

			return hasMiniTemplate.concat(noMiniTemplate);
		}

		$scope.miniTemplateActivate = false;

		log.debug('>>>>', $scope.genres);

		function openAcceptTerms (genre) {
			log.debug("openAcceptTerms(" + (genre && genre.slug) + ")", genre);

			var modal = ModalServ.get('acceptTerms');

			modal.show({genre: genre, agreeCb: function () {
				$scope.data.genre = genre;
				$scope.goToTheme();
			}});
		}

		function verifyMiniTemplateActivation () {
			var hasSelectedSn = false;
			var data = $scope.data;

			angular.forEach(data.selectedNetworks, function (val) { // (val, sn)
				if (val) {
					hasSelectedSn = true;
				}
			});

			if ( ! hasSelectedSn) {
				if (UploadMediaServ.getCount() < ConfigServ.get('min_full_template_photo')) {
					setMiniTemplateActive(true);
				} else {
					setMiniTemplateActive(false);
				}
			} else {
				setMiniTemplateActive(false);
			}
		}

		verifyMiniTemplateActivation();

		function isMiniTemplateActive () {
			return MoviemakerServ.isMiniTemplateActive();
		}

		function setMiniTemplateActive (active) {
			log.debug("setMiniTemplateActive", active);
			
			MoviemakerServ.isMiniTemplateActive(active);
			$scope.miniTemplateActivate = active;
		}

		$scope.selectGenre = function(genre) {
			log.info(genre);


			if (isMiniTemplateActive() && ! genre.config.has_mini_templates) {
				$ionicPopup.alert({
					template: gettextCatalog.getString('Por favor, selecione uma rede social ou escolha pelo menos {{num}} fotos de seu aparelho.').replace('{{num}}', ConfigServ.get('min_full_template_photo')),
					title: gettextCatalog.getString("Ops...")
				});

				return;

			} else if (genre && genre.config && genre.config.check_terms) {
				openAcceptTerms(genre);

			} else {
				$scope.data.genre = genre;
				$scope.goToTheme();
			}
		};

		$scope.goToTheme = function () {

			if ( ! $scope.data.genre) {
				$ionicPopup.alert({template: "Por favor, escolha um estilo.", title: "Ops..."});
				return;
			}

			$scope.goTo('main.moviemaker.theme', 'slide-left');
		};

		$scope.openAcceptTerms = openAcceptTerms;
	});
	
