angular.module('fun.services')
.factory('FacebookServ', function (
	$ionicModal, $rootScope, $q, $ionicPopup, $timeout, LogServ, Utils,
	ConfigServ, UserServ, SessionServ, CoolServ
) {
	var log = LogServ;

	// WHy that function ?
	// in android 4.1.2, the logout function does not work if you don't login first
	// but in ios, you need to execute logout() before login to fix the bug 'try again later'
	// that's why we need that function that is called in the fail callback of logout()
	function _getToken(permissions, deferred) {
		log.info('FacebookServ._getToken() permissions: (' + typeof permissions + ')', permissions);
		log.debug('FacebookServ._getToken::facebookConnectPlugin.login()');

		var needPreToken = false;

		if (permissions.indexOf("publish_actions") > -1) {
			// must get public_profile before login
			needPreToken = true;
		}

		if (typeof permissions === 'string') {
			permissions = permissions.split(',');
			log.debug('permissions converted to array:', typeof permissions == 'object');
		}

		var preToken = function () {

			if (needPreToken) {
				log.debug("PRETOKEN needed");

				facebookConnectPlugin.login(["public_profile"], function success (response) {
					log.debug("PRETOKEN ok response", response);

					if (Utils.isIos()) {
						// BUG: IOS FACEBOOK plugin is returning before it should
						// so we wait a little in order to fix this
						setTimeout(function () {
							posToken();
						}, 1500);
					} else {
						posToken();
					}

				}, function fail (err) {
					log.error("PRETOKEN ERROR", err);
					posToken();
				});

			} else {
				log.debug("no need for PRETOKEN");
				posToken();
			}
		};

		var posToken = function () {
			log.debug("POSTOKEN...");
			facebookConnectPlugin.login(permissions, function (response) {

				log.debug("FacebookServ._getToken::response login", response);

				if (response.authResponse) {

					log.debug('FacebookServ._getToken::api() response');
					deferred.resolve(response.authResponse.accessToken);

				} else {
					deferred.reject(response);
					log.debug('FacebookServ._getToken::User cancelled login or did not fully authorize.');
				}

			}, function (err) {
				log.info('FacebookServ._getToken::acebookConnectPlugin.login() callback error: (' + typeof err + ')', err);
				deferred.reject('not_authorized');
			});
		};

		preToken();
	}

	return {
		hasPermissions: function hasPermissions (permissions) {
			log.info("SnServ.hasPermission()");

			var params = {action: 'checkPermissions', permissions: permissions, network: 'facebook'};

			return CoolServ.get('user/' + SessionServ.getUsername() + '/token/', params);
		},
		join: function (permissions) {
			log.info("FacebookServ.join() ", permissions);

			var deferred = $q.defer();
			var self = this;

			this.getToken(permissions)
				.then(function success (token) {

					UserServ
						.saveToken(SessionServ.getUser().username, token, 'facebook')
							.then(function success () {

								self.hasPermissions(permissions).then(function (resp) {
									if (resp.data.hasPermissions) {
										SessionServ.addSn('facebook');
										deferred.resolve();

									} else {
										deferred.reject();
									}

								}, function () {
									deferred.reject();
								});

							}, function fail () {
								deferred.reject('FAILURE_WHILE_SAVING');
							}
						)
					;

				}, function fail (code) {
					deferred.reject(code);
				})
			;

			return deferred.promise;
		},
		getToken: function (permissions) {

			if ( ! permissions) {
				permissions = ConfigServ.get('facebook_read_scope');
			}

			log.info("FacebookServ.getToken()", permissions);

			var deferred = $q.defer();

			// in device
			if (Utils.isCordovaApp()) {
				log.debug("FacebookServ.getToken::ANDROID or IOS");
				log.debug("FacebookServ.getToken::facebookConnectPlugin.logout()");

				facebookConnectPlugin.logout(function () { // to fix a strange bug in the cordova plugin 'try again later'

					log.debug('FacebookServ.getToken::facebook logout done');

					_getToken(permissions, deferred);

				}, function (err) {
					log.info(err);

					_getToken(permissions, deferred);
				});

			} else { // in browser
				log.debug("BROWSER");

				var scope = {scope: permissions};

				$timeout(function () {
					FB.login(function(response) {

						log.debug('FB.login()', response);

						if (response.authResponse) {

							log.debug('FB.api()');

							FB.api('/me', {fields: 'name, picture'}, function() {
								deferred.resolve(response.authResponse.accessToken);
							});

						} else {
							log.debug('User cancelled login or did not fully authorize.');
							deferred.reject('not_authorized');
						}

					}, scope);
				}, 10);

			}

			return deferred.promise;
		},
		getThumbnail: function (images) {
			var foundImage = null;
			var resolutions = [200, 300, 400, 500, 600, 700, 800];
			var i = 0;

			while ( ! foundImage && resolutions[i]) {
				foundImage = _.find(images, function (image) {
					return (image.width > resolutions[i] && image.width <= resolutions[i] + 100);
				});

				i++;
			}

			if (foundImage) {
				return foundImage.source;
			} else {
				return null;
			}
		}
	};
});
