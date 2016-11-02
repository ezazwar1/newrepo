angular.module('fun.controllers')
	.controller('ShareStepController', function (
		movie, $rootScope, LogServ, $scope, $stateParams, $log, SessionServ, $location,
		$state, $q, ConfigServ, $ionicActionSheet, UploadMediaServ, GaServ, 
		MovieServ, $ionicPopup, MiscServ, ModalServ, $timeout, SocialNetworkServ,
		UserServ, StorageServ, MoviemakerServ, AlbumManagerServ, gettextCatalog, UIServ, Utils
	) {

		var log = LogServ;

		log.info('ShareStepController');

		$scope.fbAction = gettextCatalog.getString('Enviar');

		$timeout(function () {
			MiscServ.hideLoading();
		}, 500);

		$scope.movie = movie;

		$scope.discard = function () {
			UIServ.discardMovie(movie)
				.then(function () {
					MiscServ.goTo('main.fbmessenger.titlestep', null, {reset: 1});
				}, function () {
					MiscServ.goTo('main.fbmessenger.titlestep', null, {reset: 1});
				})
			;
		};

		$scope.produce = function () {
			log.debug("produce()");

			// flag to tell the waiting step to go ahead.
			StorageServ.set('do_video_allowed', true, 'memory');

			$scope.goTo('main.waiting', null, {
				source: 'fbmessenger'
			});
		};

		$scope.publishAndShareInMessenger = function () {
			log.debug("publishAndShareInMessenger()");

			var putData = {
				idMovie: $scope.movie.idMovie
			};

			log.debug("putData", putData);

			MiscServ.showLoading(gettextCatalog.getString('Por favor aguarde...'));

			MovieServ.publish(putData).then(
				function () {
					log.debug('Publish done');

				}, function (err) {
					log.error('Publish failed', err);
				})
				.finally(function () {
					if (Utils.isCordovaApp()) {

						var params = {idmovie: movie.idMovie, url: movie.baseUrl + "/video.mp4", title: movie.title};

						params.saveToCameraRoll = true;

						window.downloadMovieToDevice(params, function (err, file) {
							if (err) {
								alert(err);
								return;
							}

							log.debug('Downloaded: ', file);

							params.url = file;

							window.sendToFbMessenger(params, function (err) {

								if (err) {
									//alert('Failed to share to messenger');
									log.error('Fail to share in messenger');
								}

								$timeout(function () {
									StorageServ.set('do_reset', true, 'memory');

									$scope.goTo("main.fbmessenger.titlestep", null);
								
								}, 1000);
							});
						});

					} else {
						$scope.goTo("main.fbmessenger.titlestep", null, {reset: 1});
						MiscServ.hideLoading();
					}
				})
			;

			GaServ.trackViewMap("Passo_4_filme-produzido_Botao_Send");
		};

		GaServ.trackViewMap("Passo_4_filme-produzido");
	})
;
