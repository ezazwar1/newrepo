angular.module('fun.services')
	.factory('ConfigServ', function (StorageServ, CoolServ, $timeout) {

		var localConfig, miscData, urlData, serverConfig, config;

		return {
			init: function () {
				console.log('ConfigServ.init()');

				localConfig = StorageServ.get('localConfig', 'config');

				miscData = StorageServ.get('miscData', 'config');

				urlData = StorageServ.get('urlData', 'config');

				serverConfig = StorageServ.get('serverConfig', 'config');

				if (serverConfig && localConfig) {
					config = angular.extend({}, serverConfig, localConfig);
				} else {
					config = serverConfig;
				}

				if (config) {
					console.log("Config AVAILABLE", config);
					window.OuterConfig.setConfigReady();
				}

			},
			updateConfig: function () {
				console.log('ConfigServ.updateConfig()');

				var self = this;

				return CoolServ.get('config').then(function (data) {

					if ( ! angular.isObject(data)) {
						throw new Error('something is wrong, the response should be an object');
					}

					console.log("Config LOADED");
					console.log("Config::", data);

					StorageServ.set('serverConfig', data.config, 'config');
					StorageServ.set('miscData', data.misc, 'config');
					StorageServ.set('urlData', data.url, 'config');

					self.init();

				}, function () {

					$timeout(function () {

						if ( ! CoolServ.isMaintenance()) {
							self.updateConfig();
						}

					}, 5000);

				});
			},
			getResourceUrl: function (resource) {
				return CoolServ.getBaseUrl() + '/user/' + resource;
			},
			get: function (key) {
				if (typeof config === 'undefined') {
					var stack = (new Error()).stack;
					var configNotFound = "[key:" + key + "] CONFIG NOT FOUND, please configure the app ENV";
					
					console.log(configNotFound);
					console.log("stack:" + stack);

					if (window.Stayalert) {
						window.Stayalert.reportMessage(configNotFound);
					}

					return undefined;

				} else if (typeof config[key] === 'undefined') {
					var keyNotFound = "sfConfig key '" + key + "' not found";

					console.log(keyNotFound, key);

					if (window.Stayalert) {
						window.Stayalert.reportMessage(keyNotFound);
					}

					return undefined;
				}

				return config[key];
			},
			getUrl: function (key) {
				return urlData[key];
			},
			getLocalConfig: function () {
				return angular.extend({}, localConfig);
			},
			getMaintenanceUrl: function () {
				return this.get('maintenance_url') || sfLocal.maintenanceUrl;
			},
			getServerConfig: function () {
				return angular.extend({}, serverConfig);
			},
			setLocalConfig: function (conf) {
				StorageServ.set('localConfig', conf, 'config');
				localConfig = conf;
				config = angular.extend({}, serverConfig, localConfig);
			},
			getServerList: function () {
				return sfLocal.serverUrlList;
			},
			getEnv: function () {
				return window.localStorage.env;
			},
			getLogLevel: function () {
				return sfLocal.logLevel;
			},
			updateEnv: function (env) {

				if ( ! sfLocal.serverUrlList[env]) {
					throw new Error('env ' + env + ' does not exist');
				}

				window.localStorage.serverUrl = sfLocal.serverUrlList[env];
				window.localStorage.env = env;
			},
			reset: function () {
			},
			getMisc: function (key) {
				return miscData[key];
			}
		};
	})
;
