angular.module('fun.services')
	.factory('AuthServ', function (SessionServ, CoolServ, UserServ, $q, Utils, ConfigServ, StorageServ, LogServ) {
		var log = LogServ;

		return {
			login: function (username, password, options) {
				console.log(options);

				var deferred = $q.defer();

				options = options || {};

				options.username = username;
				options.password = password;
				options.includes = 'bare';
				options.iddevice = StorageServ.get('deviceToken', 'permanent');

				CoolServ
					.post('session', options)
					.then(function (data) {

						SessionServ.setIdSession(data.idSession);
						SessionServ.setUser(data.user);
						SessionServ.refreshUser();
						SessionServ.refreshNetworks();

						deferred.resolve();

					}, function (e) {
						SessionServ.removeIdSession();
						deferred.reject(e);
					});

				return deferred.promise;
			},
			loginWithToken: function (token) {
				log.info('AuthServ.loginWithToken()');

				var deferred = $q.defer();

				var params = {facebookToken: token, include: 'bare', iddevice: StorageServ.get('deviceToken', 'permanent')};

				params.appid = Utils.isCordovaApp() ? sfLocal.facebookAppId : ConfigServ.get('fb_app_id');

				log.debug('Cool.post(session)', params);
				
				CoolServ.post('session', params)
					.then(function (data) {
						log.debug('AuthServ.loginWithToken::post success cb', data);
						if ( ! data.userExists) {
							deferred.resolve(false);
						} else {

							SessionServ.setIdSession(data.idSession);
							SessionServ.setUser(data.user);
							SessionServ.refreshUser();
							SessionServ.refreshNetworks();

							deferred.resolve(true);
						}
					}, function (err) {
						deferred.reject(err);
					});

				return deferred.promise;
			},
			isAuthorized: function (permission) {
				if (permission === 'private') {
					return SessionServ.isLogged();
				} else {
					return true;
				}
			}
		};
	})
;
