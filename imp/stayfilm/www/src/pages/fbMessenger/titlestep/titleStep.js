angular.module('fun.controllers')
	.controller('TitleStepController', function (
		$scope, $rootScope, $log, SessionServ, $timeout, $location, GalleryServ,
		MovieServ, $state, ConfigServ, Utils, $q, CoolServ, $ionicModal,
		$ionicPopup, $ionicSideMenuDelegate, UploadMediaServ, FacebookServ, MiscServ,
		UserServ, $interval, SocialNetworkServ, LogServ, $stateParams, AlbumManagerServ,
		gettextCatalog, StorageServ, SnServ, $ionicPlatform, FbClientServ, 
		GaServ
	) {

		var log = LogServ;

		log.info('TitleStepMoviemakerController');

		if (StorageServ.has('do_reset', 'memory')) {
			StorageServ.unset('do_reset', 'memory');

			$timeout(function () {
				location.reload(true);
			}, 1000);
			return;
		}

		// check if the token is valid
		FbClientServ.hasPermission(function (err, has) {

			if (err && err.error && err.error.code === 190) {

				$ionicPopup.show({
					template: gettextCatalog.getString('Por favor, conceda permissão para acessar suas fotos no Facebook') + ' <br><img src="images/dialog_photos.svg" width="100" height="100">',
					buttons: [
						{ text: gettextCatalog.getString('Cancelar') },
						{
							text: '<b>' + gettextCatalog.getString('Ok') + '</b>',
							type: 'button-positive',
							onTap: function() {
								SessionServ.logout();
							}
						}
					]
				});

			} else if (has === false) {

				FbClientServ.removePermissions(function (err) {

					if (err) {
						log.debug('fail to remove permission from FB');
						return;
					}

					$ionicPopup.show({
						template: gettextCatalog.getString('Por favor, conceda permissão para acessar suas fotos no Facebook') + ' <br><img src="images/dialog_photos.svg" width="100" height="100">',
						buttons: [
							{ text: gettextCatalog.getString('Cancelar') },
							{
								text: '<b>' + gettextCatalog.getString('Ok') + '</b>',
								type: 'button-positive',
								onTap: function() {
									SessionServ.logout();
								}
							}
						]
					});

				});

			} else if (has) {
				// do nothing, this is correct

			} else {

				log.debug('Error while checking permissions of the access token', err);
				return;
			}
		});

		$scope.genres = ConfigServ.get('funny_genre_list') || ConfigServ.get('fun_moviemaker_genre_list');

		// MiscServ.registerImagePreloadUpdater(function (url) {
		// 	// look for the genre with this url and update it
		// 	$scope.genres.forEach(function (genre, i) {
		// 		if (genre.imageUrl == url) {
		// 			$scope.genres[i].preloadedImage = true;
		// 			MiscServ.cacheGenres($scope.genres);
		// 		}
		// 	});
		// });

		$scope.randomSelected = StorageServ.get('titlestep-random-selected', 'memory');

		$scope.data = AlbumManagerServ.getDataReference();

		var now = new Date();
		var formatedNow = [
			("0"+now.getDate()).substr(-2), "/", 
			("0"+(now.getMonth()+1)).substr(-2), "/", 
			now.getFullYear(),
			" ", 
			("0"+now.getHours()).substr(-2), ":", 
			("0"+now.getMinutes()).substr(-2), ":", 
			("0"+now.getSeconds()).substr(-2)
		].join("");

		$scope.data.title = formatedNow;

		log.debug("TITLE: ", $scope.data.title);

		$scope.givePermission = function () {
			FacebookServ.join('user_photos')
				.then(
					function () {
						SocialNetworkServ.startSocialJob('facebook');
						$scope.missingPermission = false;
					},
					function () {
						console.log('join failed');
						$scope.missingPermission = true;
					}
				)
			;
		};

		$scope.selectGenre = function(genre) {
			$scope.randomSelected = false;
			StorageServ.unset('titlestep-random-selected', 'memory');

			AlbumManagerServ.setGenre(genre);

			if ($scope.data.title) {
				$scope.goToMediaStep();
			}
		};

		$scope.randomGenre = function () {
			$scope.randomSelected = true;
			StorageServ.set('titlestep-random-selected', true, 'memory');

			var n = Math.floor((Math.random() * $scope.genres.length));

			var winner = $scope.genres[n];
			console.log(winner);

			AlbumManagerServ.setGenre(winner);

			if ($scope.data.title) {
				$scope.goToMediaStep();
			}
		};

		$scope.goToMediaStep = function () {
			log.info("$scope.data", $scope.data);

			if ( ! $scope.data.title) {
				$ionicPopup.alert({template: gettextCatalog.getString('Por favor, preencha o título.') + ' <br><img src="images/dialog_title.svg" width="100" height="100">', title: "Ops..."});

				GaServ.trackViewMap("Erro-do-usuario_1_faltou-titulo");
				return;
			}

			if ( ! $scope.data.genre) {
				$ionicPopup.alert({template: gettextCatalog.getString('Por favor, selecione um estilo.') + ' <br><img src="images/dialog_style.svg" width="100" height="100">', title: "Ops..."});

				GaServ.trackViewMap("Erro-do-usuario_1_faltou-estilo");
				return;
			}

			MiscServ.goTo('main.fbmessenger.mediastep', 'slide-left');
		};

		if ( ! window.openedByMessenger) {
			window.openedByMessenger = function () {};
			window.openMessenger = function () {};
		}

		if (Utils.isCordovaApp()) {
			window.openedByMessenger(function (err, has) {

				if (err) {
					log.warn('error in openedByMessenger()');
					return;
				}

				if (has) {
					$scope.showCancelButton = true;
				}
			});
		}

		$scope.openMyFilms = function () {
			MiscServ.goTo('main.fbmessenger.myfilms');
		};

		$scope.cancel = function () {
			window.openMessenger();
		};

		$scope.logout = function () {
			SessionServ.logout();
		};

		// for android back button
		var deregisterFunc = $ionicPlatform.registerBackButtonAction(function () {
			log.info('registerBackButtonAction fbmessenger titleStep EXIT APP');
			navigator.app.exitApp();
		}, 1000);
		
		$scope.$on("$destroy", function() {
			deregisterFunc();
		});

		GaServ.trackViewMap("Passo_1-_Titulo-e-Estilo");
	})
;
