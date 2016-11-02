angular.module('fun.services')
	.factory('SessionServ', function (
		$rootScope, $log, StorageServ, ConfigServ, Utils, $q, $http, 
		UserServ, CoolServ, LogServ, $timeout, gettextCatalog, GaServ
	) {
		var log = LogServ,
			data = {networks: {}},
			idsession
		;

		return {
			init: function () {
				log.debug('SessionServ.init()');

				var self = this;

				if (StorageServ.get('idSession')) {
					self.setIdSession(StorageServ.get('idSession'));
				}

				if (StorageServ.get('user')) {
					self.setUser(StorageServ.get('user'));
				}
			},
			setLang: function (lang) {
				lang = lang.split('-')[0];

				console.log("MY LANGUAGE IS: ", lang);

				var availableLangs = [
					'en',
					'pt',
					'es',
					'fr',
					'it',
					'tr',
					'zh'
				];

				if ( ! _.contains(availableLangs, lang)) {
					log.error("'" + lang + "' language is not currently available");
					lang = 'en';
				}

				GaServ.stateView("language-change-" + lang);

				gettextCatalog.currentLanguage = lang;
				StorageServ.set('lang', lang);

				log.debug('setLang()', lang);

				if ( ! this.isLogged()) {
					return;
				}

				return CoolServ.put('session', {lang: lang});
			},
			getLang: function () {
				return gettextCatalog.currentLanguage;
			},
			initLanguage: function () {
				log.debug('SessionServ.initLanguage()');

				var deferred = $q.defer(),
					self = this;

				if (StorageServ.get('lang')) {
					this.setLang(StorageServ.get('lang'));

					$timeout(function () {
						deferred.resolve();
					}, 10);

				} else {
					if (Utils.isCordovaApp() && navigator.globalization) {

						navigator.globalization.getPreferredLanguage(
							function (language) {

								self.setLang(language.value);

								deferred.resolve();
							},
							function () {
								self.setLang('en');
								deferred.resolve();
							}
						);

					} else {

						$timeout(function () {
							self.setLang(navigator.language || navigator.userLanguage || 'en');
							deferred.resolve();
						}, 10);
					}
				}

				return deferred.promise;
			},
			refreshNetworks: function () {

				log.debug('SessionServ.refreshNetworks()');

				return UserServ.getNetworks(this.getUser().username).then(function (networks) {

					log.debug('networks', networks);


					_.forEach(networks, function (n) {
						data.networks[n] = true;
					});

					_.forEach(data.networks, function (integrated, n) {
						if ( ! _.contains(networks, n)) {
							data.networks[n] = false;
						}
					});

					StorageServ.set('networks', data.networks);
				});
			},
			refreshUser: function () {
				var self = this;

				return UserServ.get(this.getUser().username).then(function (user) {
					self.setUser(user);
				});
			},
			isLogged: function () {
				return !! data.user;
			},
			setIdSession: function (id) {
				idsession = id;
				StorageServ.set('idSession', idsession);
				CoolServ.setIdSession(idsession);
			},
			getIdSession: function () {
				return idsession;
			},
			removeIdSession: function () {
				idsession = null;
				return StorageServ.remove('idSession');
			},
			getUser: function () {
				return data.user;
			},
			getUsername: function () {
				return data.user && data.user.username;
			},
			setUser: function (user) {

				if ( ! data.user) {
					data.user = {};
				}

				if ( ! user.photo) {
					user.photo = ConfigServ.getUrl('defaultProfile');
				}

				angular.extend(data.user, user);

				if (window.Stayalert) {
					window.Stayalert.setUser(user.username);
				}

				StorageServ.set('user', data.user);
			},
			getNetworks: function () {

				// to make sure sf_upload and sf_album_manager are integrated ALWAYS !
				data.networks.sf_upload = true;
				data.networks.sf_album_manager = true;
				
				return data.networks;
			},
			addSn: function (sn) {
				data.networks[sn] = true;
				StorageServ.set('networks', data.networks);
			},
			reset: function () {
				log.debug('SessionServ.reset()');

				if (document.cookie) {
					document.cookie = "sf_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
				}
				
				data = {networks: {}};
				idsession = null;
				CoolServ.removeIdSession();
				StorageServ.removeAll();
			},
			logout: function () {
				log.debug('logout()');

				GaServ.stateView("user-logout");
				
				CoolServ
					.delete('session', {iddevice: StorageServ.get('deviceToken', 'permanent')})
					.then(function () {
						log.debug('session deleted');
					}, function () {
						log.debug('error while session deleted');
					})
				;

				this.reset();

				$timeout(function () {
					location.reload('/');
				}, 100);
			},
			checkSession: function () {

				log.debug('SessionServ.checkSession()');

				var self = this;

				if ( ! idsession) {
					return;
				}

				return CoolServ.get('session', {include: 'user-bare'}).then(function (resp) {

					if (resp.user) { // logged in
						self.setUser(resp.user);

						self.setIdSession(StorageServ.get('idSession')); // optional

						self.refreshNetworks();
						self.refreshUser();
					} else {
						self.logout();
					}

				}, function () {
					self.logout();
				});
			}
		};
	})
;
