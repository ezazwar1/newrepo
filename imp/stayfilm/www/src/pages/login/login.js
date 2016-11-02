angular.module('fun.controllers')
	.controller('LoginController', function (
		$scope, $log, AuthServ, SessionServ, $state, CoolServ, UserServ, $ionicPopup,
		FacebookServ, MiscServ, LogServ, $rootScope, $timeout, gettextCatalog
	) {
		var log = LogServ;
		log.info('LoginController');

		if (SessionServ.isLogged()) {
			MiscServ.goTo('main.home.feed');
			return;
		}

		$scope.user = {};
		$scope.user.username = sfLocal.loginUsername;
		$scope.user.password = sfLocal.loginPassword;

		$scope.goTo = function (state) {
			MiscServ.goTo(state);
		};

		$scope.signIn = function (user) {

			if ( ! user.username || ! user.password) {
				$ionicPopup.alert({
					title: 'Já está cadastrado?',
					content: "Por favor, preencha seus dados de login, ou use o Facebook para entrar."
				});

				return;
			}

			MiscServ.showLoading();
			
			var promise = AuthServ.login(user.username, user.password, {lang: SessionServ.getLang()});

			promise.then(function () {
				var loadAfterLogin = window.localStorage.loadAfterLogin;

				if (loadAfterLogin) {
					MiscServ.loadAfterLogin();

				} else {
					MiscServ.goTo('main.home.feed');
				}

				$timeout(function () {
					MiscServ.hideLoading();
				}, 500);

				$scope.updateNotifCount();

			}, function (err) {
				log.debug("LOGIN ERROR: ", err);

				MiscServ.hideLoading();

				if (err.status === 401) {
					$ionicPopup.alert({
						title: 'Verifique seus dados',
						content: 'E-mail ou senha inválidos.'
					});
				} else {
					$ionicPopup.alert({
						title: 'Problema ao entrar',
						content: 'Por favor, tente novamente.'
					});
				}

			});
		};

		$scope.loginWithFacebook = function () {
			log.debug('loginWithFacebook ()');

			MiscServ.showLoading(null, 20000);

			var permissions = 'email,user_birthday,user_location,user_photos,user_videos,user_friends';

			MiscServ.loginWithFacebook(permissions).then(function (resp) {
				log.debug('loginWithFacebook() callback', resp);

				if (resp === 'register') {

					MiscServ.goTo('main.invite');

					$rootScope.me = SessionServ.getUser();

					MiscServ.showQuickMessage(gettextCatalog.getString('Seja bem-vindo, <br>divirta-se !'), 2000);

				} else { // login
					MiscServ.goTo('main.home.feed');
					$rootScope.me = SessionServ.getUser();
					$scope.updateNotifCount();
				}

			}, function (err) {

				log.debug('error loginWithFacebook', err);

				MiscServ.hideLoading();

				if (err === 'not_authorized') { // user canceled
					return;
				}

				var message = (err && err.data && err.data.friendlyMessage) ||  gettextCatalog.getString('Um erro aconteceu ao criar sua conta via Facebook. Por favor, cria sua conta manualmente.');

				$ionicPopup.alert({
					title: gettextCatalog.getString('Oups...'),
					content: message
				});

			});
		};

		$timeout(function () {
			$('[disabled]').removeAttr('disabled');
		}, 500);
	})
;
