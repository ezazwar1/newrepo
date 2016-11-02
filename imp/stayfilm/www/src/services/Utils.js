angular.module('fun.services')
	.factory('Utils', function () {

		return {
			isFirstStartup: function () {
				return ! window.localStorage.idsession;
			},
			/**
			 * return a string in english about the connection
			 *
			 * @method getConnectionString
			 * @return {string}
			 */
			getConnectionString: function () {

				var networkState = this.getConnectionType();

				if (networkState === 'web') {
					return 'Connection Type Not Available (web context)';
				}

				var states = {};
				states[Connection.UNKNOWN]  = 'Unknown connection';
				states[Connection.ETHERNET] = 'Ethernet connection';
				states[Connection.WIFI]     = 'WiFi connection';
				states[Connection.CELL_2G]  = 'Cell 2G connection';
				states[Connection.CELL_3G]  = 'Cell 3G connection';
				states[Connection.CELL_4G]  = 'Cell 4G connection';
				states[Connection.NONE]     = 'No network connection';

				return states[networkState];
			},
			/**
			 * return the phonegap code for the connection type OR "web" if no information available
			 *
			 * @method getConnectionType
			 * @return {mixed} string OR integer
			 */
			getConnectionType: function () {

				if ( ! (navigator &&  navigator.connection)) {
					return 'web';
				}

				if ( ! navigator.connection.type) {

					if (Connection) {
						return Connection.NONE;
					} else {
						return 'web';
					}
				}

				return navigator.connection.type;
			},
			/**
			 * tell if a fast connexion is availabe (wifi or web context)
			 *
			 * @method hasFastConnexion
			 * @return {boolean}
			 */
			hasFastConnexion: function () {
				var networkState = this.getConnectionType();

				return (networkState === 'web' || Connection.WIFI === networkState);
			},
			/**
			 * tell if connected to the internet
			 *
			 * @method isConnected
			 * @return {boolean}
			 */
			isConnected: function () {
				var type = this.getConnectionType();

				if (type === 'web') {
					return navigator.onLine;
				}
				
				return  window.Connection ? type !== Connection.NONE : true;
			},
			isOffline: function () {
				return ! navigator.onLine;
			},
			isOnline: function () {
				return navigator.onLine;
			},
			isCordovaApp: function () {
				return !! window.cordova;
			},
			useHeader: function () {
				var regex = /https?:\/\//;

				var serverUrl = window.localStorage.serverUrl.replace(regex, '');

				var regex2 = new RegExp('^' + serverUrl);

				if ( ! location.hostname.match(regex2)) {
					return true;
				}

				if (sfLocal.forceHeader) {
					return true;
				}

				if (this.isCordovaApp()) {
					return true;
				}

				return false;
			},
			isAndroidOrIos: function () {
				return !!this.isAndroid() || !!this.isIos();
			},
			isFirefoxOs: function () {

			},
			isDevice: function () {
				return !!this.isAndroid() || !!this.isIos();
			},
			isIos: function () {
				return !!navigator.userAgent.match(/iPhone/i) || !!navigator.userAgent.match(/iPod/i) || !!navigator.userAgent.match(/iPad/i);
			},
			isAndroid: function () {
				return !!navigator.userAgent.match(/android/i);
			},
			getPlatform: function () {
				var platform;

				if (this.isIos()) {
					platform = "Iphone";

				} else if (this.isAndroid()) {
					platform = "Android";

				} else {
					platform = "UNKNOWN-PLATFORM";
				}

				return platform;
			},
			url: function (path) {
				return JSON.parse(window.localStorage.config).wsBaseUrl + '/' + path;
			},
			getUUID: function () {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
					return v.toString(16);
				});
			},
			log: function () {
				var params = [];
				var self = this;

				angular.forEach(arguments, function (val) {
					var stringify = false;

					if (true || self.isDevice()) {
						if ( ! sfLocal.weinre) {
							if (angular.isArray(val) || angular.isObject(val)) {
								stringify = true;
							}
						}
					}

					if (stringify) {

						try {
							params.push(JSON.stringify(val));
						} catch (e) {
							params.push(val);
						}

					} else {
						params.push(val);
					}

				});

				console.log.apply(console, params);
			},
			configExists: function () {
				return !! window.localStorage.serverConfig;
			},
			initFB: function (appId, done) {
				console.log('Utils.initFB()');

				var conf = {
							appId      : appId,
							status     : true, // check login status
							cookie     : true, // enable cookies to allow the server to access the session
							xfbml      : true  // parse XFBML
					};

				console.log('FB conf', conf);

				window.fbAsyncInit = function() {
					console.log('fbAsyncInit()');

					FB.Event.subscribe('auth.statusChange', function(response) {
						if(response.status == 'connected') {
							if (done) {
								done(); // facebook is fully loaded in browser
							}
						}
					});

					FB.init(conf);
				};

				(function(d, s, id){
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {return;}
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/en_US/all.js";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			},
			/* jshint ignore:start */
			getUrlInfo: (function() {
				function isNumeric(arg) {
					return !isNaN(parseFloat(arg)) && isFinite(arg);
				}

				return function(url, arg) {
					var _ls = url || window.location.toString();

					if (!arg) { return _ls; }
					else { arg = arg.toString(); }

					if (_ls.substring(0,2) === '//') { _ls = 'http:' + _ls; }
					else if (_ls.split('://').length === 1) { _ls = 'http://' + _ls; }

					url = _ls.split('/');
					var _l = {auth:''}, host = url[2].split('@');

					if (host.length === 1) { host = host[0].split(':'); }
					else { _l.auth = host[0]; host = host[1].split(':'); }

					_l.protocol=url[0];
					_l.hostname=host[0];
					_l.port=(host[1] || ((_l.protocol.split(':')[0].toLowerCase() === 'https') ? '443' : '80'));
					_l.pathname=( (url.length > 3 ? '/' : '') + url.slice(3, url.length).join('/').split('?')[0].split('#')[0]);
					var _p = _l.pathname;

					if (_p.charAt(_p.length-1) === '/') { _p=_p.substring(0, _p.length-1); }
					var _h = _l.hostname, _hs = _h.split('.'), _ps = _p.split('/');

					if (arg === 'hostname') { return _h; }
					else if (arg === 'domain') {
						if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(_h)) { return _h; }
						return _hs.slice(-2).join('.');
					}
					//else if (arg === 'tld') { return _hs.slice(-1).join('.'); }
					else if (arg === 'sub') { return _hs.slice(0, _hs.length - 2).join('.'); }
					else if (arg === 'port') { return _l.port; }
					else if (arg === 'protocol') { return _l.protocol.split(':')[0]; }
					else if (arg === 'auth') { return _l.auth; }
					else if (arg === 'user') { return _l.auth.split(':')[0]; }
					else if (arg === 'pass') { return _l.auth.split(':')[1] || ''; }
					else if (arg === 'path') { return _l.pathname; }
					else if (arg.charAt(0) === '.')
					{
						arg = arg.substring(1);
						if(isNumeric(arg)) {arg = parseInt(arg, 10); return _hs[arg < 0 ? _hs.length + arg : arg-1] || ''; }
					}
					else if (isNumeric(arg)) { arg = parseInt(arg, 10); return _ps[arg < 0 ? _ps.length + arg : arg] || ''; }
					else if (arg === 'file') { return _ps.slice(-1)[0]; }
					else if (arg === 'filename') { return _ps.slice(-1)[0].split('.')[0]; }
					else if (arg === 'fileext') { return _ps.slice(-1)[0].split('.')[1] || ''; }
					else if (arg.charAt(0) === '?' || arg.charAt(0) === '#')
					{
						var params = _ls, param = null;

						if(arg.charAt(0) === '?') { params = (params.split('?')[1] || '').split('#')[0]; }
						else if(arg.charAt(0) === '#') { params = (params.split('#')[1] || ''); }

						if(!arg.charAt(1)) { return params; }

						arg = arg.substring(1);
						params = params.split('&');

						for(var i=0,ii=params.length; i<ii; i++)
						{
							param = params[i].split('=');
							if(param[0] === arg) { return param[1] || ''; }
						}

						return null;
					}

					return '';
				};
			})()
			/* jshint ignore:end */
		};
	})
;
