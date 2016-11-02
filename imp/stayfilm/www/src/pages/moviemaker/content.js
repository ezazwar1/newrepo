angular.module('fun.controllers')
	.controller('ContentMoviemakerController', function (
		$scope, $rootScope, $log, SessionServ, $timeout, $location, GalleryServ,
		MovieServ, $state, ConfigServ, Utils, $q, CoolServ, $ionicModal,
		$ionicPopup, $ionicSideMenuDelegate, UploadMediaServ, FacebookServ, MiscServ,
		UserServ, $interval, SocialNetworkServ, LogServ, $stateParams, MoviemakerServ,
		gettextCatalog, $ionicActionSheet, RoutingServ, GaServ
	) {

		var log = LogServ;

		log.info('ContentMoviemakerController');
		
		ConfigServ.updateConfig();

		var data = $scope.data = MoviemakerServ.getDataReference();

		$scope.uploadPercentage = 0;

		$scope.uploadInfo = UploadMediaServ.getUploadInfo();

		$scope.mediaList = UploadMediaServ.getQueueReference();

		UploadMediaServ.addSubscriber('media-uploaded.moviemaker' , function () {
			$scope.uploadInfo = UploadMediaServ.getUploadInfo();

			$scope.uploadPercentage = UploadMediaServ.getProgress();

			if ( ! UploadMediaServ.isWorking()) {
				if (UploadMediaServ.getCount('FAIL')) {
					showOptionsForFail();
				}
			}

			console.log('uploadPercentage', $scope.uploadPercentage);
		});

		$scope.$on('$destroy', function() {
			UploadMediaServ.removeSubscriber('.moviemaker');
		});

		$scope.toggleNetwork = function (network) {

			log.debug(data.selectedNetworks[network]);

			if ( ! data.selectedNetworks[network]) {
				return;
			}

			data.selectedNetworks[network] = false; // to prevent toggle

			MiscServ.showLoading(null, 20000);

			var permission;

			if (network === 'facebook') {
				permission = ConfigServ.get('facebook_read_scope');
			}

			MiscServ.toggleNetwork(network, permission)
				.then(
					function () {

						MoviemakerServ.addIntegratedNetwork(network);
						MoviemakerServ.addSelectedNetwork(network);

						SocialNetworkServ.startSocialJob(network);
					},
					function () {
						log.debug('failure');
					}
				).finally(function () {
					MiscServ.hideLoading();
				})
			;

		};

		$scope.uploadInfo = UploadMediaServ.getUploadInfo();

		$scope.uploadPercentage = UploadMediaServ.getProgress();

		$scope.networks = ConfigServ.get('fun_networks', 'config');

		$scope.rotatorImgUrl = null;
		var rotatorIndex = 0;

		$interval(function rotatorInterval() {

			if ($scope.mediaList.length === 0) {
				$scope.rotatorImgUrl = null;
				return;
			}

			if (rotatorIndex >= $scope.mediaList.length) {
				rotatorIndex = 0;
			}

			$scope.rotatorImgUrl = $scope.mediaList[rotatorIndex].uri;

			rotatorIndex++;

		}, 3000);

		$scope.goToGenre = function (transition) {
			log.info("$scope.data", data);

			if ( ! data.title) {
				$ionicPopup.alert({template: gettextCatalog.getString("Por favor, preencha o título."), title: gettextCatalog.getString("Ops...")});
				return;
			}

			var hasSelectedSn = false;

			angular.forEach(data.selectedNetworks, function (val) { // (val, sn)
				if (val) {
					hasSelectedSn = true;
				}
			});

			if ( ! hasSelectedSn) {
				if (UploadMediaServ.getCount() < ConfigServ.get('min_mini_template_photo')) {
					$ionicPopup.alert({
						template: gettextCatalog.getString('Por favor, selecione uma rede social ou escolha pelo menos {{num}} fotos de seu aparelho.').replace('{{num}}', ConfigServ.get('min_mini_template_photo')),
						title: gettextCatalog.getString("Ops...")
					});

					return;
				} else if (UploadMediaServ.getCount() < ConfigServ.get('min_full_template_photo')) {
					MoviemakerServ.setMiniTemplateActive(true);
				} else {
					MoviemakerServ.setMiniTemplateActive(false);
				}
			} else {
				MoviemakerServ.setMiniTemplateActive(false);
			}

			_.forEach(data.selectedNetworks, function (bool, network) {
				SocialNetworkServ.startSocialJob(network);
			});

			$scope.goTo('main.moviemaker.genre', transition || 'slide-left');
		};

		var tagListModalScope;
		var tagListScope = $rootScope.$new(true);
		tagListScope.tagStep = {};
		tagListScope.data = $scope.data;
		$scope.data.tags = $scope.data.tags || [];

		$scope.openTagList = function () {
			// open tag modal

			GaServ.stateView("main.moviemaker.content-tags");

			$ionicModal.fromTemplateUrl('src/pages/moviemaker/tagList.html', {
				scope: tagListScope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				tagListModalScope = modal;

				modal.show();

				function focusTagField() {
					$timeout(function () {
						$('.item-input-wrapper input').trigger('focus');
					}, 1000);
				}

				modal.scope.addTag = function () {
					console.log("modal.scope.tagStep.tagItem", modal.scope.tagStep.tagItem);
					if (modal.scope.tagStep.tagItem) {
						$scope.data.tags.push(modal.scope.tagStep.tagItem);
						modal.scope.tagStep.tagItem = "";
					}

					focusTagField();

					console.log("$scope.data.tags", $scope.data.tags);
				};

				modal.scope.removeTag = function (index) {
					$scope.data.tags.splice(index, 1);
				};

				modal.scope.closeTagList = function () {
					tagListModalScope = null;

					modal.scope.addTag();

					modal.remove();
				};

				focusTagField();

			});
		};

		$scope.openMediasOrUpload = function () {
			if ($scope.mediaList.length === 0) {
				$scope.chooseMedias();
			} else {
				$rootScope.goTo('main.moviemaker.upload');
			}
		};

		function showOptionsForFail () {

			var options = [];

			// some uploads failed ?
			if (UploadMediaServ.getCount("FAIL") > 0) {

				options.push({label: gettextCatalog.getString('Tentar novamente'), callback: function () {
					UploadMediaServ.uploadFailed();
				}});

				options.push({label: gettextCatalog.getString('Ver fotos'), callback: function () {
					$scope.goTo('main.moviemaker.upload');
				}});
			}

			log.info(options);

			$ionicActionSheet.show({
				titleText: gettextCatalog.getString('Não foi possível carregar todas as fotos.'),
				buttons: _.map(options, function (option) {
					return {text: option.label};
				}),
				cancelText: gettextCatalog.getString('Cancelar'),
				buttonClicked: function(index) {

					options[index].callback();

					return true;
				}
			});
		}

		var bypassConfirm = false;
		RoutingServ.registerCb(function (newStateParams) {
			log.info("content::RoutingServ.registerCb()", newStateParams);

			// fix for backbutton with tag modal open
			var isModalOpen = !!tagListModalScope;
			if (isModalOpen) {
				log.info("BACKBUTTON: Close tag modal.");
				tagListModalScope.scope.closeTagList();
				return false;
			}

			var regexInsideMovieMaker = /main\.moviemaker/;
			var regexWaitingStep = /main\.waiting/;
			var mustDestroyConfirm = !!newStateParams.name.match(regexWaitingStep);
			
			if (mustDestroyConfirm) {
				log.info("Destroy moviemaker confirmation");
				RoutingServ.deregisterCb();
				return true;
			}

			var mustConfirmExit = !newStateParams.name.match(regexInsideMovieMaker);

			if (bypassConfirm || ! mustConfirmExit) {
				log.info("Confirmation bypassed: ", bypassConfirm);
				log.info("Must confirm exit: ", mustConfirmExit);
				bypassConfirm = false; // reset bypass
				return true;
			}

			// confirmação antes de sair do moviemaker
			// verificar se existe algo preenchido antes de voltar, para então pedir confirmação
			var isFilled;

			var hasSelectedSn = false;
			angular.forEach(data.selectedNetworks, function (val) { // (val, sn)
				if (val) {
					hasSelectedSn = true;
				}
			});

			isFilled = isFilled || hasSelectedSn;
			isFilled = isFilled || !!data.title;
			isFilled = isFilled || !!data.subtheme;
			isFilled = isFilled || !!data.theme;
			isFilled = isFilled || !!data.genre;

			log.info("selectedNetworks", data.selectedNetworks);
			log.info("title", data.title);
			log.info("subtheme", data.subtheme);
			log.info("theme", data.theme);
			log.info("genre", data.genre);

			if (isFilled) {
				log.info("Form is filled, must confirm exit.");

				var confirmPopup = $ionicPopup.confirm({
					title: gettextCatalog.getString('Produzir filme'),
					template: gettextCatalog.getString('Descartar') + '?'
				});

				confirmPopup.then(function(res) {
					if(res) {
						bypassConfirm = true;
						$scope.goTo(newStateParams.name);
						
						log.info("Destroy moviemaker confirmation");
						RoutingServ.deregisterCb();
					}
				});

				return false;
			}

			return true;
		});
	})
;
