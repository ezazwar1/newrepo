angular.module('fun.services')
	.factory('UIServ', function (
		$q,LogServ, MovieServ, ModalServ, gettextCatalog, $ionicActionSheet, MiscServ, FbClientServ,
		$rootScope, StorageServ, $timeout, SessionServ, BgTaskManager, Utils, $ionicPopup, FacebookServ
	) {

		var log = LogServ;

		return {
			tryAgainPopup: function (err, done) {
				MiscServ.hideLoading();

				log.error('error while requesting facebook', err);

				$ionicPopup.show({
					template: gettextCatalog.getString('Não foi possível conectar ao Facebook.') + '<br><img src="images/dialog_alert.svg" width="100" height="100">',
					buttons: [
						{ text: gettextCatalog.getString('Cancelar') },
						{
							text: '<b>' + gettextCatalog.getString('Tentar novamente') + '</b>',
							type: 'button-positive',
							onTap: function() {

								if (err && err.error && err.error.code && (err.error.code === 190 || err.error.type === 'OAuthException')) { // invalid token in FB

									MiscServ.showLoading(null, 20000);

									var permissions = 'user_photos,email,user_videos,public_profile';

									FacebookServ.getToken(permissions).then(function(token) {
										log.debug('FacebookServ.getToken callback', token);

										$timeout(function() {
											MiscServ.hideLoading();

										}, 0);

										FbClientServ.setToken(token);

										done();

									}, function(err) {

										log.debug('error while getting token', err);

										MiscServ.hideLoading();

										if (err === 'not_authorized') { // user canceled
											log.debug('it seems that the user cancel the login proccess in Facebook app');
											return;
										}
									});

								} else {
									done();
								}
							}
						}
					]
				});
			},

			discardMovie: function (movie) {

				log.debug('discardMovie()');

				var deferred = $q.defer();

				$ionicActionSheet.show({
					buttons: [
						{ text: gettextCatalog.getString('Descartar') }
					],
					cancelText: gettextCatalog.getString('Cancelar'),
					buttonClicked: function(index) {

						if (index === 0) {

							MiscServ.showLoading();

							MovieServ.discard(movie.idMovie).then(function () {
								log.debug("MOVIE DELETED", movie);

								MiscServ.showLoading(gettextCatalog.getString('Seu filme foi descartado.'), null, true);

								$rootScope.$emit('movie-deleted', movie);
								$rootScope.$broadcast('movie-deleted', movie);

								StorageServ.remove('profile.pending', true);

								SessionServ.refreshUser();

								$timeout(function () {
									deferred.resolve();
									MiscServ.hideLoading();
								}, 2000);

								if (sfLocal.appContext == "fbmessenger" && Utils.isCordovaApp()) {
									window.deleteMovieFromDevice(movie.idMovie, function (err, params) {
										if (err) {
											log.error("Could not delete local movie", err, params);
											return;
										}

										log.info("Local movie deleted", movie.idMovie, params);
									});
								}

							}, function (err) {

								log.error("discardMovie ERROR", err);

								BgTaskManager.add(function () {
									MovieServ.discard(movie.idMovie);
								});

								deferred.reject(err);

								MiscServ.hideLoading();
							});
						}

						return true;
					}
				});

				return deferred.promise;
			},

			changeMoviePermission: function(movie) {
				console.log("changeMoviePermission", movie);

				var privacyOptions = [
					{ text: '<img src="images/ico-lock.png" class="sf-icon-action-sheet"> ' +  gettextCatalog.getString("Privado")},
					{ text: '<img src="images/ico-friend-gray.png" class="sf-icon-action-sheet"> ' + gettextCatalog.getString("Amigo")},
					{ text: '<img src="images/ico-unlock.png" class="sf-icon-action-sheet"> ' + gettextCatalog.getString("Público")}
				]

				var currentPrivacy = movie.permission || 0;

				console.log("currentPrivacy", currentPrivacy);

				if (currentPrivacy) {
					privacyOptions[currentPrivacy-1].text += ' <i class="ion-arrow-left-a"></i>';
				}

				// Show the action sheet
				var hidePrivacyActionSheet = $ionicActionSheet.show({
					buttons: privacyOptions,
					titleText: gettextCatalog.getString('Quem pode ver este filme?'),
					cancelText: gettextCatalog.getString('Cancelar'),
					buttonClicked: function(index) {
						hidePrivacyActionSheet();

						var permission;

						if (index === 0) {
							permission = 1;
						}

						if (index === 1) {
							permission = 2;
						}

						if (index === 2) {
							permission = 3;
						}

						MiscServ.showLoading();

						MovieServ.updatePermission(movie.idMovie, permission).then(function () {

							movie.permission = permission;

							MiscServ.hideLoading();
						}, function (err) {
							log.error(err);
							MiscServ.hideLoading();
							MiscServ.showError('Ação indisponivel. Tente novamente mais tarde !');
						});

						return true;
					}
				});
			}
		};
	})
;
