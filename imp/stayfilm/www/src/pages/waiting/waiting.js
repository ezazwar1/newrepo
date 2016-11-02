angular.module('fun.controllers')
	.controller('WaitingController', function(
		$scope, $log, $stateParams, $interval, SessionServ, GaServ, $rootScope, 
		$location, GalleryServ, MovieServ, $state, $timeout, Utils, AdMobServ,
		StorageServ, LogServ, UploadMediaServ, $ionicPopup, RoutingServ, gettextCatalog,
		$ionicActionSheet, ConfigServ, AlbumManagerServ, MoviemakerServ, MiscServ,
		ProgressBarServ
	) {
		var log = LogServ;

		log.debug('WaitingController');

		var source = $stateParams.source;
		$scope.appContext = source === 'fbmessenger' ? 'fbmessenger' : 'default';

		var poller;
		var idjob;
		var movieProductionParams;
		$scope.totalProgress = 0;
		var cancelPoller = false;

		var visualProgress = 0;


		function drawProgress(value) {
			log.info("drawProgress(" + value + ")");

			$timeout(function () {
				if (angular.isUndefined(value) || value === null || value === false) {
					log.error("drawProgress value", typeof value, value);
					return;
				}

				if (parseInt(visualProgress, 10) < parseInt(value, 10)) {
					// $scope.totalProgress = value;
					ProgressBarServ.jobTime(value);
				}
			}, 0);
		}

		ProgressBarServ.init(function setProgress(val) {
			$timeout(function () {
				visualProgress = parseInt(val, 10);
				log.info("setProgress( " + visualProgress + " )");
				$scope.totalProgress = visualProgress;
			}, 0);
		});


		// back button - to access the waiting page, the previous page must put a flag into the StorageServ
		// if not, we redirect the user to the feed
		if ( ! StorageServ.get('do_video_allowed', 'memory')) {

			log.debug('waiting not allowet without a flag in StorageServ - do_video_allowed');

			if (source === 'fbmessenger') {
				MiscServ.goTo('main.fbmessenger.titlestep');
			} else {
				MiscServ.goTo('main.home.feed');
			}
			return;
		} else {
			StorageServ.remove('do_video_allowed', 'memory');
		}

		// if (source === "albummanager" || source === "fbmessenger") {

		// 	if (AlbumManagerServ.mediaCount() === 0) {
		// 		throw new Error('0 media in AlbumManager.');
		// 	}
		// }

		//RoutingServ.registerCb(function (toState) {
		//
		//	if (toState && ! _.contains(['main.publish', 'main.fbmessenger.sharestep'], toState.name)) {
		//
		//		if (window.confirm(gettextCatalog.getString('Deseja mesmo sair?'))) {
		//			return source === 'fbmessenger' ? 'main.fbmessenger.titlestep' : 'main.home.feed';
		//		} else {
		//			return false;
		//		}
		//	}
		//
		//	return true;
		//});

		var genre = source === 'fbmessenger' ? AlbumManagerServ.getGenre() : MoviemakerServ.getGenre();

		var showAds = genre && genre.config && genre.config.fun_waiting_step_ad;

		if (showAds) {
			if (showAds.ad_idmovie) {
				log.info('NO ADMOB, Show template campaign movie');
				MovieServ
					.get(showAds.ad_idmovie)
					.then(function (movie) {
						movie.poster_url = showAds.poster_url;
						$scope.adMovie = movie;
					})
				;

			} else if (showAds.ad_url) {
				log.info('NO ADMOB, Show template campaign image');
				$scope.adImage = showAds.ad_url;

			} else {
				log.info('there is ad flag, but no configuration was found, SHOW ADBMOB');
				// if no campaign is set,
				// fallback to show AdMob Banner
				AdMobServ.hide();
				AdMobServ.show();
			}

		} else {
			log.info('no ad flag, SHOW ADBMOB');
			// if no campaign is set,
			// fallback to show AdMob Banner
			AdMobServ.hide();
			AdMobServ.show();
		}

//		$scope.adImage = 'http://www.mangauk.com/gallery/albums/album-19/lg/akira_04.jpg'; // portrait
//		$scope.adImage = 'http://i2.cdnds.net/13/27/618x926/akira.jpg'; // landscape

		$scope.$on('$destroy', function () {
			log.debug('destroy');

			RoutingServ.deregisterCb();

			UploadMediaServ.removeSubscriber('.waiting');

			AdMobServ.hide();

			ProgressBarServ.stopAll();

			cancelPoller = true;

			if (poller) {
				$timeout.cancel(poller);
			}

			if (window.cancelDownload && Utils.isIos()) {
				log.debug('Canceling download');

				window.cancelDownload(function (err, resp) {
					if (err) {
						log.error('Error while canceling download', err);
					} else {
						log.error('Download canceled', resp);
					}
				});
			}
		});

		UploadMediaServ.addSubscriber('media-uploaded.waiting', function () {
			log.debug('media-uploaded callback');

			drawUploadProgress(UploadMediaServ.getProgress());

			if ( ! UploadMediaServ.isWorking()) {

				if (UploadMediaServ.getCount('FAIL')) {
					showOptionsForFail();
				} else {
					drawUploadProgress(100);
					resetProgressAndProduce();
				}
			}
		});

		if (UploadMediaServ.isWorking()) {

			$scope.action = 'uploading';

			drawUploadProgress(UploadMediaServ.getProgress());

		} else if (UploadMediaServ.getCount('FAIL') > 0) {

			$scope.action = 'uploading';

			drawUploadProgress(UploadMediaServ.getProgress());

			UploadMediaServ.uploadFailed();

		} else {
			log.debug("No upload or upload already finished, gathering info");

			$scope.action = 'gathering';

			drawUploadProgress(100);
			drawProgress(0);
			resetProgressAndProduce();
		}



		function drawUploadProgress(value) {
			$scope.totalUploadProgress = value;
		}

		$scope.cancel = function () {

			if (source === 'fbmessenger') {
				MiscServ.goTo('main.fbmessenger.titlestep');
			} else {
				MiscServ.goTo('main.home.feed');
			}
		};

		function poll() {

			if ( ! idjob) {
				throw new Error('missing idjob');
			}

			log.debug('poll()');

			poller = $timeout(function() {

				if (cancelPoller) {
					return;
				}

				MovieServ.poll(idjob).then(function(resp) {
					var progress = resp.data.progress;
					var status = resp.status;

					log.debug("progress", progress, 'status', status);

					if (status === "SUCCESS") {
						var idmovie = resp.data.idmovie;
						
						ProgressBarServ.closingTime(function () {

							AdMobServ.hide();

							if (source === 'fbmessenger') {

								if (Utils.isCordovaApp()) {
									MiscServ.getMovie(idmovie).then(function (movie) {

										var params = {idmovie: movie.idMovie, url: movie.baseUrl + "/video.mp4", title: movie.title};

										params.saveToCameraRoll = true;

										MiscServ.showLoading(gettextCatalog.getString('Baixando...'));

										$timeout(function () {

											var interval;

											log.debug('Downloading movie to device (waitingstep)...', params);

											window.downloadMovieToDevice(params, function (err) {
												log.debug('Download complete !! (waitingstep)', err);

												if (err) {
													log.error(err); // lets continue, the download will be done in the next page
												}

												$scope.goTo("main.fbmessenger.sharestep", null, {idmovie: movie.idMovie});

												log.debug('Cancel ping progress');

												if (interval) {
													$interval.cancel(interval);
												}
											});

											if (window.checkDownloadProgress) {
												var progressCheck = 0;

												interval = $interval(function () {

													// stayfunny checkDownloadProgress method signature 
													// is different from stayfun and
													// here there is no (obj, callback)
													// just (callback), like myFilms.js

													window.checkDownloadProgress(function (err, progress) {
														log.debug('download progress', progress);

														progress = parseInt(progress, 10);

														if (err) {
															log.error('Error in progress callback', err);
															return;
														}

														if (progress > progressCheck && progress <= 100) {
															progressCheck = progress;
															MiscServ.showLoading(gettextCatalog.getString('Baixando...') + ' (' + progress + '%)');
														}
													});
												}, 1000);
											}
										}, 500);

									}, function () {
										log.debug('fail to get the movie');
										alert(gettextCatalog.getString('Algo está errado...') + "" + gettextCatalog.getString('Por favor tente novamente.'));
									});
								} else {
									$scope.goTo("main.fbmessenger.sharestep", null, {idmovie: idmovie});
								}

							} else {
								$scope.goTo("main.publish", null, {idmovie: idmovie, source: source});
							}
						});


					} else if (resp.data.status === "FAILURE") {
						alert("FAILURE!");
					} else {
						drawProgress(progress);
						poll();
					}
				}, function () {
					poll();
				});
			}, 4000);
		}

		function resetProgress() {

			log.debug("// desativa transição");

			$scope.removeTransitionClass = true;

			$timeout(function () {
				log.debug("// ZERA BARRA");
				//drawProgress(0);
				ProgressBarServ.bufferTime();
			}, 1000);
		}

		function resetProgressAndProduce () {

			resetProgress();

			if (source === 'albummanager') {
				AlbumManagerServ.save().then(function() {
					doVideo();
				}, function() {
					alert('Save failed');
					$scope.goTo('main.albummanager.contentzone');
				});
			} else if (source === 'fbmessenger') {

				doVideo();

			} else {
				$timeout(function () {

					$scope.removeTransitionClass = false;

					doVideo();
				}, 1500);
			}
		}

		function showOptionsForFail () {

			var options = [];

			// some uploads failed ?
			if (UploadMediaServ.getCount("FAIL") > 0) {

				options.push({label: gettextCatalog.getString('Tentar novamente'), callback: function () {
					UploadMediaServ.uploadFailed();
				}});

				options.push({label: gettextCatalog.getString('Ver fotos'), callback: function () {

					RoutingServ.deregisterCb();

					if (source === 'albummanager') {
						$scope.goTo('main.albummanager.contentzone');
					} else {
						$scope.goTo('main.moviemaker.upload', null, {source: source});
					}

				}});
			}

			// is there enough media ?
			if (source === 'albummanager') {
				if (AlbumManagerServ.mediaCount() >= ConfigServ.get('min_mini_template_photo')) {
					options.push({label: gettextCatalog.getString('Produzir'), callback: function () {
						resetProgressAndProduce();
					}});
				}
			} else {
				if (UploadMediaServ.getCount("UPLOADED") >=  ConfigServ.get('min_mini_template_photo') || MoviemakerServ.hasSnSelected()) {
					options.push({label: gettextCatalog.getString('Produzir'), callback: function () {
						resetProgressAndProduce();
					}});
				}
			}

			log.info(options);

			var showTryAgain = !$(".action-sheet-backdrop.active").length;

			if (showTryAgain) {
				$ionicActionSheet.show({
					titleText: gettextCatalog.getString('Não foi possível carregar todas as fotos.'),
					buttons: _.map(options, function (option) {
						return {text: option.label};
					}),
					buttonClicked: function(index) {

						options[index].callback();

						return true;
					}
				});
			}
		}

		function doVideo () {
			log.info("doVideo()");

			$scope.action = 'gathering';

			if (source === 'albummanager') {

				movieProductionParams = AlbumManagerServ.getPreparedParamsForMovie();

			} else if (source === 'fbmessenger') {

				movieProductionParams = AlbumManagerServ.getPreparedParamsFB();

				_.each(UploadMediaServ.getQueueReference(), function (media) {
					movieProductionParams.medias.push(media);
				});

			} else {
				movieProductionParams = MoviemakerServ.getPreparedParams();
			}

			movieProductionParams.duration = sfLocal.movieDuration;

			log.info("movieProductionParams", movieProductionParams);

			var request = MovieServ.doVideo(movieProductionParams)
				.then(function success (resp) {
					log.info("resp", resp);

					// job has been created - http code: 201
					if (resp.idjob) {
						$scope.action = 'producing';
						idjob = resp.idjob;
						poll();
					} else {
						// job has not been created  - http code: 200

						if (resp.socialnetworkPendingJob || resp.imageAnalyzerPendingJob) {
							log.info("But Social Network or Image Analyzer is working, let's try again in 4s", resp);

							$timeout(function () {
								doVideo();
							}, 5000);

						} else {

							ProgressBarServ.stopAll();

							$ionicPopup.alert({
								title: gettextCatalog.getString('Desculpe'),
								content: gettextCatalog.getString("Não encontramos conteúdo suficiente para criar seu filme. Por favor verifique.")
							}).then(function () {

								RoutingServ.deregisterCb();

								if (source === 'albummanager') {
									$scope.goTo("main.albummanager.contentzone");
								} else if (source === 'fbmessenger') {
									$scope.goTo("main.fbmessenger.mediastep");
								} else {

									var params = {};

									AlbumManagerServ.reset();

									if (MoviemakerServ.hasAlbum()) {
										params = {idalbum: MoviemakerServ.getIdAlbum()};
									} else {
										params = MoviemakerServ.getPreparedParams();

										_.remove(params.networks, function(network) {
											return network === 'sf_upload';
										});

										params.data = JSON.stringify(params);
									}

									$scope.goTo('main.albummanager.contentzone', null, params);
								}
							});
						}
					}

				}, function fail (error) {

					log.error("doVideo ERROR", error);

					ProgressBarServ.stopAll();

					if (error.status === 0) {

						var confirmPopup = $ionicPopup.confirm({
							title: gettextCatalog.getString('Ops...'),
							template: gettextCatalog.getString('Algo está errado...') + ' ' + gettextCatalog.getString('Tentar novamente ?')
						});

						confirmPopup.then(function(res) {
							if(res) {
								resetProgressAndProduce();
							} else {

								if (source === 'fbmessenger') {
									$scope.goTo("main.fbmessenger.titlestep");
								} else if (source === 'albummanager') {
									$scope.goTo("main.albummanager.contentzone");
								} else {
									$scope.goTo("main.moviemaker.content");
								}
							}
						});

					} else {

						var message = gettextCatalog.getString('Por favor tente novamente.');

						if ( error.data.friendlyMessage ) {
							message = error.data.friendlyMessage;
						}

						RoutingServ.deregisterCb();

						$ionicPopup.alert({
							title: gettextCatalog.getString('Serviço indisponível'),
							content: message
						}).then(function () {
							if (source === 'fbmessenger') {
								$scope.goTo("main.fbmessenger.titlestep");
							} else if (source === 'albummanager') {
								$scope.goTo("main.albummanager.contentzone");
							} else {
								$scope.goTo("main.moviemaker.content");
							}
						});
					}
				})
			;

			log.info("resquest sent... i promise:", request);
		}

		GaServ.trackViewMap("Passo_3_produzindo-filme_tela-trailler");
	})
;
