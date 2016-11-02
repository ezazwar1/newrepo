angular.module('fun.controllers')
	.controller('HomeController', function (
		$scope, LogServ, SessionServ, MoviemakerServ, UploadMediaServ, AlbumManagerServ,
		gettextCatalog, MiscServ, $ionicActionSheet, ModalServ, $timeout
	) {

		var log = LogServ;

		log.info('HomeController()');

		$scope.startMoviemaker = function () {

			log.debug('startMoviemaker()');

			MoviemakerServ.reset();
			UploadMediaServ.reset();

			MiscServ.goTo('main.moviemaker.content');
		};

		$scope.goToWithNotif = function (state) {
			$scope.updateNotifCount();
			MiscServ.goTo(state);
		};

		$scope.showOptions = function() {

			var buttons = [
				{ text: gettextCatalog.getString('Busca') },
				{ text: gettextCatalog.getString('Amigos do Facebook') },
				{ text: gettextCatalog.getString('Sobre') },
				{ text: gettextCatalog.getString('Idioma') },
				{ text: gettextCatalog.getString('Sair') }
			];

			if (SessionServ.getUser().role === 'admin' || window.localStorage.debug) {
				buttons.push({text: gettextCatalog.getString('admin')});
			}

			// Show the action sheet
			$ionicActionSheet.show({
				buttons: buttons,
				cancelText: gettextCatalog.getString('Cancelar'),
				buttonClicked: function(index) {

					if (index === 0) {
						MiscServ.goTo('main.home.search', null, null, {reload: true});
					}

					if (index === 1) {
						MiscServ.goTo('main.invite');
					}

					if (index === 2) {
						MiscServ.goTo('main.home.about');
					}

					if (index === 3) {
						showLanguages();
					}

					if (index === 4) {
						SessionServ.logout();
					}

					if (index === 5) {
						showTools();
					}

					return true;
				}
			});
		};


		var languageMap = [
			{ en: 'English'   },
			{ pt: 'Português' },
			{ es: 'Español'   }
		];

		var user = SessionServ.getUser();
		var isAdmin = user && (user.role === 'admin');
		var isFbmessenger = sfLocal.appContext === 'fbmessenger';

		var showParcialLanguages = isAdmin || isFbmessenger;

		if (showParcialLanguages) { // only if admin or fbmessenger
			languageMap.push({ fr: 'Français' });
			languageMap.push({ it: 'Italiano' });
			languageMap.push({ tr: 'Türkçe'   });
			languageMap.push({ zh: '繁體中文'  });

			// languageMap.push({ th: gettextCatalog.getString('Tailandês') });
			// languageMap.push({ hu: gettextCatalog.getString('Húngaro') });
			// languageMap.push({ vi: gettextCatalog.getString('Vietnamita') });
		}

		var checkmark = ' <span class="ion-checkmark-circled" style="font-size: 24px"></span>';

		var isSelected = function (langCode) {
			return SessionServ.getLang() === langCode ? checkmark : '';
		};

		var langButtons = [];
		var langCount = languageMap.length;
		var langCode, i;

		for (i = 0; i < langCount; i++) {
			langCode = Object.keys(languageMap[i])[0];
			langButtons.push({ text: languageMap[i][langCode] + isSelected(langCode) });
		}

		var showLanguages = function() {
			// Show the action sheet
			$ionicActionSheet.show({
				buttons: langButtons,
				cancelText: gettextCatalog.getString('Cancelar'),
				buttonClicked: function(index) {

					var promise;

					MiscServ.showLoading();

					for (i = 0; i < langCount; i++) {
						langCode = Object.keys(languageMap[i])[0];
						if (index === i) {
							promise = SessionServ.setLang(langCode);
							break;
						}
					}

					promise.then(function () {
						location.reload();
					}).finally(function () {
						MiscServ.hideLoading();
					});

					return true;
				}
			});
		};


		var showTools = function () {
			// Show the action sheet
			$ionicActionSheet.show({
				buttons: [
					{ text: 'Log page' },
					{ text: 'Config' },
					{ text: 'Refresh user networks' },
					{ text: 'Log popup' },
					{ text: 'Album Manager' },
					{ text: 'Sandbox' },
					{ text: 'fbmessenger' },
					{ text: 'Reset' },
				],
				buttonClicked: function(index) {
					switch (index) {
						case 0:
							MiscServ.goTo('admin.log');
							break;
						case 1:
							MiscServ.goTo('admin.config');
							break;
						case 2:
							MiscServ.showLoading('');

							SessionServ.refreshNetworks().finally(function () {
								MiscServ.hideLoading();
							});
							break;
						case 3:
							var m = ModalServ.get('log');
							m.show();
							break;
						case 4:
							AlbumManagerServ.reset();
							MiscServ.goTo('main.albummanager.contentzone');
							break;
						case 5:
							showSandbox();
							break;
						case 6:
							MiscServ.goTo("main.fbmessenger.titlestep");
							break;
						case 7:
							window.localStorage.clear();

							$timeout(function () {
								location.reload();
							}, 1000);

							break;
					}

					return true;
				}
			});
		};

		var showSandbox = function () {
			// Show the action sheet
			$ionicActionSheet.show({
				buttons: [
					{ text: 'jwplayer' }
				],
				buttonClicked: function(index) {
					switch (index) {
						case 0:
							MiscServ.goTo('sandbox.jwplayer');
							break;
					}

					return true;
				}
			});
		};
	})
;
