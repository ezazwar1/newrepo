angular.module('fun.services')
	.factory('CoolServ', function(Restangular, $rootScope, Utils, $timeout, $ionicLoading, gettextCatalog) {

		var offline = false,
		    maintenance = false,
		    alreadyCheckingConnection = false,
			idsession;

		Restangular.setErrorInterceptor(function(response) {

			if (window.Stayalert) {
				window.Stayalert.reportServerResponse(response);
			}

			if (offline || maintenance) {
				// do nothing
			} else {
				if (response.status === 0 || response.status === 503) {

					offline = true;

					if ( ! alreadyCheckingConnection) {
						checkConnection();
					}
				}
			}

			return true; // error not handled
		});

		function checkConnection() {

			alreadyCheckingConnection = true;

			if (maintenance) {
				offline = false;
				$ionicLoading.hide();
				alreadyCheckingConnection = false;
				return;
			}

			restangular.one('config').get()
				.then(
					function () {
						offline = false;
						$ionicLoading.hide();

						alreadyCheckingConnection = false;
					},
					function () {

						$ionicLoading.show({
							template: gettextCatalog.getString('Aguardando conexão com internet') +
							'<br /><a on-hold="switchServer()" style="opacity: 0">switch server</a>'
						});

						$timeout(function () {
							checkConnection();
						}, 3000);
					}
				)
			;
		}

		var restangular = Restangular.withConfig(function(RestangularConfigurer) {
			RestangularConfigurer.setBaseUrl(window.localStorage.serverUrl + '/rest/');
		});

		if (Utils.useHeader()) {
			restangular.configuration.defaultHeaders.useheader = 1;
		}

		return {
			subscribers: {},
			addSubscriber: function (eventName , func, sub) {
				if ( ! this.subscribers[eventName]) {
					this.subscribers[eventName] = [];
				}

				this.subscribers[eventName].push({obj: sub, func: func});
			},
			setIdSession: function (id) {
				idsession = id;
			},
			setMaintenance: function (isActive) {
				maintenance =  isActive;
			},
			isMaintenance: function () {
				return maintenance;
			},
			fire: function (eventNameFired, params) {
				console.log( 'CoolServ::fire() : ' + eventNameFired);

				angular.forEach(this.subscribers, function (list, eventName) {

					if (eventNameFired === eventName) {

						angular.forEach(list, function (o) {
							o.func.call(o.obj, params);
						});
					}
				});
			},
			getBaseUrl: function () {
				return restangular.configuration.baseUrl;
			},
			configureHeader: function () {
				if (Utils.useHeader()) {
					if (idsession) {
						restangular.configuration.defaultHeaders.idsession = idsession;
					}
				}
			},
			get: function (path, params, options) {
				this.configureHeader();

				var promise = restangular.one(path);

				if (options && options.timeout) {
					promise = promise.withHttpConfig({timeout: options.timeout});
				}

				return promise.get(params);
			},
			post: function (path, params) {

				this.configureHeader();

				return restangular.all(path).post(params);
			},
			delete: function (path, params) {

				this.configureHeader();

				return restangular.one(path).remove(params);
			},
			customGET: function (path, params) {
				return $.get(window.localStorage.serverUrl + "/" + path, params);
			},
			customPOST: function (path, params) {

				this.configureHeader();

				return restangular.one(path).customPOST(params);
			},
			removeIdSession: function () {
				idsession = null;
				delete restangular.configuration.defaultHeaders.idsession;
			},
			put: function (path, params) {
				this.configureHeader();
				return restangular.one(path).customPUT(params);
			}
		};
	})
;
