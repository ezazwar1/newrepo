(function (){

	jwplayer.key="TATqeE5R29tKHltyBlAB7lSM8r0USys+jQY0jw==";

	if ( ! window.FUN_VERSION) {
		window.FUN_VERSION = '-';
	}

	if (navigator.splashscreen && navigator.splashscreen.hide) {
		navigator.splashscreen.hide();
	}

	var url;
	var env = window.localStorage.env || false;
	var localServerUrl = window.localStorage.serverUrl || "";
	var protocol = localServerUrl.substr(0, 5);
	var isProdHttps = (env == 'prod' && localServerUrl && protocol == 'https');
	var isDev = (env != 'prod' && localServerUrl);

	if (env) {
		if (isProdHttps || isDev) {
			url = localServerUrl;
		} else {
			env = sfLocal.defaultServer;
			url = sfLocal.serverUrlList[sfLocal.defaultServer];
		}
	} else {
		env = sfLocal.defaultServer;
		url = sfLocal.serverUrlList[sfLocal.defaultServer];
	}

	console.log('protocol', url.substr(0, 5), 'env', env, 'serverUrl', url);

	window.localStorage.serverUrl = url;
	window.localStorage.env = env;

	window.handleOpenURL = function handleOpenURL(url) {
		//console.log('handleOpenUrl', url);

		window.localStorage.setItem("targetURL", url);
	};

	window.OuterConfig = {
		isDeviceReady: false,
		isConfigReady: false,
		configReadyCallbacks: [],
		deviceReadyCallbacks: [],
		deviceAndConfigReadyCallbacks: [],
		execCallback: function (callback) {
			console.log('## $$ %% execCallback');
			if (typeof callback == "function") {
				callback();
			}
		},
		digestList: function (list) {
			console.log('## $$ %% digestList > ', list.length);
			while(list.length) {
				this.execCallback(list.shift());
			}
		},
		digest: function () {
			console.log('## $$ %% digest');
			if (this.isDeviceReady && this.isConfigReady && this.deviceAndConfigReadyCallbacks.length) {
				this.digestList(this.deviceAndConfigReadyCallbacks);
			}

			if (this.isDeviceReady && this.deviceReadyCallbacks.length) {
				this.digestList(this.deviceReadyCallbacks);
			}

			if (this.isConfigReady && this.configReadyCallbacks.length) {
				this.digestList(this.configReadyCallbacks);
			}
		},
		setDeviceReady: function () {
			console.log('## $$ %% setDeviceReady');
			this.isDeviceReady = true;
			this.digest();
		},
		setConfigReady: function () {
			console.log('## $$ %% setConfigReady');
			this.isConfigReady = true;
			this.digest();
		},
		whenDeviceReady: function (callback) {
			console.log('## $$ %% whenDeviceReady');
			this.deviceReadyCallbacks.push(callback);
			this.digest();
		},
		whenConfigReady: function (callback) {
			console.log('## $$ %% whenConfigReady');
			this.configReadyCallbacks.push(callback);
			this.digest();
		},
		whenConfigAndDeviceReady: function (callback) {
			console.log('## $$ %% whenConfigAndDeviceReady');
			this.deviceAndConfigReadyCallbacks.push(callback);
			this.digest();
		}
	};

	function initPushwoosh() {
		angular
			.element(document.body)
			.injector()
			.get("PushServ")
			.initPushwoosh();
	}

	window.OuterConfig.whenConfigAndDeviceReady(initPushwoosh);

	document.addEventListener('deviceready', function () {
		window.OuterConfig.setDeviceReady();
	}, false);
})();
