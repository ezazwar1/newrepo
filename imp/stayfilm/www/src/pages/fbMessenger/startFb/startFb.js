angular.module('fun.controllers')
	.controller('StartFbController', function(
		$scope, $state, $timeout, $ionicGesture, SessionServ, GaServ, 
		LogServ, MiscServ, $rootScope, $ionicPopup, gettextCatalog, Utils
	) {

		var log = LogServ;

		log.info('StartFbController');

		if (SessionServ.isLogged()) {
			$scope.goTo('main.fbmessenger.titlestep');
			return;
		}

		if (window.openedByMessenger) {
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

		$scope.currentLanguage = SessionServ.getLang();


		if ( ! Utils.isCordovaApp()) {
			$scope.facebookNotAvailable = true;
		}

		MiscServ.whenFacebookReady(function () {
			$scope.facebookNotAvailable = false;
		});

		$scope.loginWithFacebook = function() {

			log.info('starFb::loginWithFacebook()');

			MiscServ.showLoading(null, 20000);

			var permissions = 'user_photos,email,user_videos,public_profile';

			MiscServ.loginWithFacebook(permissions).then(function(resp) {
				log.debug('loginWithFacebook() callback', resp);

				function accessApp() {
					setTimeout(function() {
						MiscServ.hideLoading();
					}, 2000);

					$rootScope.me = SessionServ.getUser();
					MiscServ.goTo('main.fbmessenger.titlestep');
				}

				window.OuterConfig.whenConfigAndDeviceReady(accessApp);


			}, function(err) {

				log.debug('error while loginWithFacebook', err);

				MiscServ.hideLoading();

				if (err === 'not_authorized') { // user canceled
					log.debug('it seems that the user cancel the login proccess in Facebook app');
					return;
				}

				var message = (err && err.data && err.data.friendlyMessage) || gettextCatalog.getString('Um erro aconteceu ao criar sua conta via Facebook. Tenta novamente.');

				$ionicPopup.alert({
					title: gettextCatalog.getString('Oups...'), content: message
				});

			});
		};

		GaServ.trackViewMap("inicio");
	}
);
