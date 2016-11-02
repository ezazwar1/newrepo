angular.module('fun.controllers')
	.controller('PublishController', function (
		movie, $rootScope, LogServ, $scope, $stateParams, $log, SessionServ, $location,
		$state, $q, FacebookServ, ConfigServ, $ionicActionSheet, sfSlideBoxDelegate,
		MovieServ, $ionicPopup, MiscServ, ModalServ, $timeout, SocialNetworkServ,
		UserServ, StorageServ, MoviemakerServ, AlbumManagerServ, gettextCatalog, UIServ,
		UploadMediaServ
	) {

		var log = LogServ;
		
		log.debug('PublishController');

		UploadMediaServ.clearTempFiles(); // clear temps if any

		$scope.movie = movie;

		var source = $stateParams.source;

		var genreList = ConfigServ.get('fun_moviemaker_genre_list', 'config');
		
		var thisMovieGenre = _.find(genreList, function (genre) {
			return genre.idgenre === $scope.movie.idGenre;
		});


		// the key is the permission code in the DB
		var permissionMap = {
			1: {
				name: gettextCatalog.getString("Privado"),
				icon: "ico-lock"
			},
			2: {
				name: gettextCatalog.getString("Amigo"),
				icon: "ico-friend-gray"
			},
			3: {
				name: gettextCatalog.getString("Público"),
				icon: "ico-unlock"
			}
		};

		$scope.permission = {
			name: permissionMap[3].name,
			icon: permissionMap[3].icon,
			code: 3
		};

		var data = $scope.data = {
			integratedNetworks: SessionServ.getNetworks(),
			selectedNetworks: _.clone(SessionServ.getNetworks())
		};
		
		$scope.data.synopsis = getGenreHashtag();

		$scope.networks = ConfigServ.get('fun_sharable_networks') || ['facebook', 'twitter'];

		if (_.contains($scope.networks, 'whatsapp')) {

			MiscServ.canShareVia('whatsapp').then(function (canShare) {
				log.debug('canShare', canShare);

				$scope.whatsappActive = canShare;
				data.shareInWhatsapp = canShare;
			}, function (msg) {
				log.debug(msg);
			});
		}

		$scope.changePermission = function() {
			$ionicActionSheet.show({
				buttons: [
					{ text: '<img src="images/' + permissionMap[1].icon + '.png" class="sf-icon-action-sheet"> ' + permissionMap[1].name },
					{ text: '<img src="images/' + permissionMap[2].icon + '.png" class="sf-icon-action-sheet"> ' + permissionMap[2].name },
					{ text: '<img src="images/' + permissionMap[3].icon + '.png" class="sf-icon-action-sheet"> ' + permissionMap[3].name }
				],
				titleText: gettextCatalog.getString('Quem pode ver este filme?'),
				cancelText: gettextCatalog.getString('Cancelar'),
				cancel: function () {
					// do nothing
					return true;
				},
				buttonClicked: function(index) {
					log.debug(permissionMap[index + 1].name);

					$scope.permission = {
						name: permissionMap[index + 1].name,
						icon: permissionMap[index + 1].icon,
						code: index + 1
					};

					return true;
				}
			});
		};

		$scope.discard = function () {
			UIServ.discardMovie(movie).then(function () {
				log.info("Movie discard success, goto to TITLE STEP");
				$scope.goTo('main.moviemaker.content');
			}, function () {
				log.error("Movie discard ERROR, goto to TITLE STEP");
				$scope.goTo('main.moviemaker.content');
			});
		};

		// $scope.permission = function (permission) {
		// 	$scope.formData.permission = permission;
		// };

		$scope.produce = function () {
			log.debug("produce()");

			// flag to tell the waiting step to go ahead.
			StorageServ.set('do_video_allowed', true, 'memory');

			$scope.goTo('main.waiting', null, {
				source: source
			});
		};

		$scope.refine = function () {
			log.debug("refine()");

			var params = {};

			//UploadMediaServ.reset(); << WHY IS THIS HERE ???

			if (source === 'moviemaker') {

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
			} else {
				$scope.goTo('main.albummanager.contentzone', null);
			}
		};

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

		if (source) {
			$scope.showProduceAgain = true;
		}

		//var privacyMapping = {private: 1, friend: 2, public: 3};

		function shareViaInstagram(done) {

			MovieServ.tagShare('instagram', movie.idMovie);

			MiscServ.callInstagram(movie)
				.then(
					function () {
						log.info('INSTAGRAM Success');
						done();
					},
					function (err) {
						log.error('INSTAGRAM ERROR', err);
						done();
					}
				)
			;
		}

		function shareViaWhatsapp(done) {

			MovieServ.tagShare('whatsapp', movie.idMovie);

			MiscServ.callWhatsapp(movie)
				.then(
					function () {
						log.info('WHATSAPP Success');
						done();
					},
					function (err) {
						log.error('WHATSAPP ERROR', err);
						done();
					}
				)
			;
		}

		function saveToDevice (callback) {
			MovieServ.saveToDevice(movie, callback);
		}

		function showSharingOptions() {
			// TODO: injetar compartilhamento condicional
			//       - caso tenha opção de compartilhamento, mostre
			//       - senão, pula direto para o cancel (feed)

			var buttons = [
				{ text: 'Instagram' + '<div class="item-image instagram">' },
				{ text: 'Whatsapp' + '<div class="item-image whatsapp">' }
			];

			if (window.downloadMovieToDevice) {
				buttons.push({ text: 'Download' + '' });
			}

			$ionicActionSheet.show({
				titleText: gettextCatalog.getString('Você também pode compartilhar nessas redes'),
				buttons: buttons,
				cancelText: gettextCatalog.getString('Agora não, obrigado'),
				cancel: function () {
					$scope.goTo('main.home.feed');
				},
				buttonClicked: function(index) {

					if (index === 0) { // instagram
						shareViaInstagram(showSharingOptions);
					}

					if (index === 1) { // whatsapp
						shareViaWhatsapp(showSharingOptions);
					}

					if (index === 2) { // download
						saveToDevice(function () {
							showSharingOptions();
						});
					}

					return true;
				}
			});
		}

		function shareEnd (msg, skipSharingOptions) {
			MiscServ.hideLoading();
			
			if (skipSharingOptions) {
				$ionicPopup.alert({
					title: gettextCatalog.getString('Obrigado!'),
					content: msg
				})
				.then(function () {
					$scope.goTo('main.home.feed');
				});
			} else {
				MiscServ.showQuickMessage(msg, 3000, function () {
					showSharingOptions();
				});
			}
		}

		function publishMovie (movieHasCuration) {
			console.log("publishMovie()");

			var putData = {
				idMovie: $scope.movie.idMovie,
				permission: $scope.permission.code,
				synopsis: $scope.data.synopsis
			};

			log.debug("facebook", $scope.data.facebookPublish);

			MiscServ.showLoading(null, 20000);

			var networks = [];

			if (putData.permission === 3 && $scope.data.selectedNetworks.twitter) {
				MovieServ.tagShare('twitter', movie.idMovie);
				networks.push('twitter');
			}

			if (putData.permission === 3 && $scope.data.selectedNetworks.facebook) {
				MovieServ.tagShare('facebook', movie.idMovie);
				networks.push('facebook');

				var facebookPermission = ConfigServ.get('facebook_publish_scope');

				MiscServ.toggleNetwork('facebook', facebookPermission).finally(function () {
					log.debug("Facebook permission seems ok");
					finishPublish();
				});
			} else {
				finishPublish();
			}

			function finishPublish () {
				putData.socialNetwork = networks.join(',');

				log.debug("putData", putData);
				
				MiscServ.hideLoading();
				MiscServ.showLoading(gettextCatalog.getString('Publicando filme...'), 20000);

				var resultMessage;

				MovieServ.publish(putData)
					.then(
						function () {
							if (networks.length) { // the movie has been shared in some networks
								resultMessage = gettextCatalog.getString('Seu filme foi compartilhado.');
							} else {
								resultMessage = gettextCatalog.getString('Seu filme foi publicado.');
							}

							if (movieHasCuration) {
								resultMessage = gettextCatalog.getString("O conteúdo de todos os filmes são de responsabilidade do usuário e serão avaliados para que estejam de acordo com os Termos de Publicação.");
							}

							shareEnd(resultMessage, movieHasCuration);
						},
						function (err) {
							resultMessage = (err && err.data && err.data.friendlyMessage) ||
									gettextCatalog.getString('Não foi possível publicar seu filme em todas as redes. Por favor, tente novamente mais tarde');
							shareEnd(resultMessage, movieHasCuration);
						}
					)
				;
			}
		}

		$scope.publish = function () {
			log.debug('publish');

			var genreHasCuration;

			if (thisMovieGenre && thisMovieGenre.config && thisMovieGenre.config.curation) {
				genreHasCuration = thisMovieGenre.config.curation;
			} else {
				genreHasCuration = false;
			}

			if (genreHasCuration) {
				publishMovie(true);

			} else {
				publishMovie();
			}
		};

		function getGenreHashtag () {
			var genreHashtag;

			if (thisMovieGenre && thisMovieGenre.config && thisMovieGenre.config.facebook_ad_text) {
				genreHashtag = thisMovieGenre.config.facebook_ad_text;
			} else {
				genreHashtag = "";
			}

			return genreHashtag;
		}

		console.log("$scope.data", $scope.data);
	})
;
