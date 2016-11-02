angular.module('fun.controllers')
	.controller('ShareModalController', function (
		$scope, $rootScope, LogServ, ConfigServ, MoviemakerServ,
		MiscServ, SessionServ, MovieServ, gettextCatalog,
		$timeout, $ionicPlatform, RoutingServ, $q
	) {
		var log = LogServ;

		var movie = $scope.data.movie;

		log.debug("movie", movie);

		$scope.movieUrl = movie.pageWatchUrl;
		$scope.movie = movie;
		$scope.me = $rootScope.me;

		log.debug('registerCB');

		// for android back button
		var deregisterFunc = $ionicPlatform.registerBackButtonAction(function () {

			log.debug('WatchModalController - back button callback');

			$scope.modal.hide();
			deregisterFunc();
		}, 311);

		RoutingServ.registerCb(function (toState) {

			log.debug('callback', toState);

			$scope.modal.hide();

			return false;
		});

		$scope.$on('$destroy', function () {
			log.debug('deregister');
			RoutingServ.deregisterCb();
		});

		$scope.networks = ConfigServ.get("fun_sharable_networks") || ['facebook', 'twitter'];
		log.debug("$scope.networks", $scope.networks);

		var selectedNetworks = {};

		if ( ! movie.shared) {
			selectedNetworks.stayfilm = true;
		}

		_.each(SessionServ.getNetworks(), function (val, network) {
			if (_.contains($scope.networks, network)) {
				selectedNetworks[network] = true;
			}
		});

		var data = $scope.data = {
			integratedNetworks: SessionServ.getNetworks(),
			selectedNetworks: selectedNetworks,
			message: ''
		};

		if (_.contains($scope.networks, 'whatsapp')) {

			MiscServ.canShareVia('whatsapp').then(function (canShare) {
				log.debug('canShare', canShare);

				$scope.whatsappActive = canShare;
				data.shareInWhatsapp = canShare;
			}, function (msg) {
				log.debug(msg);
			});
		}

		$scope.toggleNetwork = function (network) {

			log.debug(data.selectedNetworks[network]);

			if ( ! data.selectedNetworks[network]) {
				return;
			}

			data.selectedNetworks[network] = false; // to prevent toggle

			MiscServ.showLoading(null, 20000);

			var permission;

			if (network === 'facebook') {
				permission = ConfigServ.get('facebook_publish_scope');
			}

			MiscServ.toggleNetwork(network, permission).then(
				function () {
					log.debug('ok swtich on');
					// tudo bem - do nothing
					$scope.data.selectedNetworks[network] = true;
				},
				function () {
					$scope.data.selectedNetworks[network] = false;
				}
			).finally(function () {
				MiscServ.hideLoading();
			});
		};

		// BROKEN: mantis #1712
		// $scope.toggleNetwork = function (network) {

		// 	if (data.integratedNetworks[network]) {
		// 		return;
		// 	}

		// 	// network not integrated

		// 	data.selectedNetworks[network] = false; // to prevent toggle

		// 	MiscServ.toggleNetwork(network)
		// 		.then(
		// 			function () {
		// 				// toggle
		// 			},
		// 			function () {
		// 				log.debug('MiscServ.toggleNetwork failure');
		// 			}
		// 	);
		// };

		$scope.hasNetworkSelected = function () {
			return _.contains(selectedNetworks, true) || data.shareInWhatsapp;
		};

		$scope.shareMovie = function () {

			if ( ! $scope.hasNetworkSelected()) {
				return;
			}

			MiscServ.showLoading();

			log.info("share in", data.selectedNetworks);

			if (data.selectedNetworks.facebook) {
				var facebookPermission = ConfigServ.get('facebook_publish_scope');

				MiscServ.toggleNetwork('facebook', facebookPermission).finally(function () {
					log.debug("Facebook permission seems ok");
					continueShare();
				});
			} else {
				continueShare();
			}

			function continueShare () {
				var promises = [];
				var resultMessage;

				_.forEach(data.selectedNetworks, function (selected, network) {

					if ( ! selected) {
						return;
					}

					var params = {
						idMovie: movie.idMovie,
						network: network,
						message: data.message
					};

					MovieServ.tagShare(network, movie.idMovie);

					var p = MovieServ.share(params);

					promises.push(p);
				});

				$q.all(promises).then(
					function success () {
						log.info("movie shared successfully in networks");

						movie.shared = true; // at this point, the movie has been shared in stayfilm, always.

						if (data.shareInWhatsapp) {
							log.info("sharing in whatsapp...");

							MovieServ.tagShare('whatsapp', movie.idMovie);

							MiscServ.callWhatsapp(movie).then(
								function() {
									log.info('WHATSAPP Success');
									resultMessage = gettextCatalog.getString('Filme compartilhado.');
								},
								function(err) {
									log.error('WHATSAPP ERROR', err);
									resultMessage = gettextCatalog.getString('Não foi possível compartilhar no Whatsapp. <br> Whatsapp está instalado?');
								}
							)
							.finally(function () {
								shareEnd(resultMessage);
							});
						} else {
							resultMessage = gettextCatalog.getString('Filme compartilhado.');
						}
					},
					function fail (err) {
						log.error("error while sharing movie", err);

						resultMessage = (err && err.data && err.data.friendlyMessage) ||
							gettextCatalog.getString('Não foi possível publicar seu filme em todas as redes. Por favor, tente novamente mais tarde');
					}
				)
				.finally(function () {
					if ( ! data.shareInWhatsapp) {
						shareEnd(resultMessage);
					}
				});

				function shareEnd (msg) {
					MiscServ.showQuickMessage(msg, 3000, function () {
						$scope.modal.hide();
					});
				}
			};
		};
	})
;
