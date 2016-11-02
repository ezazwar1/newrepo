(function () {

	function log() {

		var params = ['BOOT'];

		_.forEach(arguments, function (val) {

			if (angular.isArray(val) || angular.isObject(val)) {
				try {
					params.push(JSON.stringify(val));
				} catch (e) {
					params.push('[Complex Array or Object]');
				}
			} else {
				params.push(val);
			}

		});

		console.log.apply(console, params);
	}


	// jwplayer configuration
	jwplayer.key="TATqeE5R29tKHltyBlAB7lSM8r0USys+jQY0jw==";

	// polyfill
	if ( ! window.URL) {

		// window.URL
		log('window.URL not availbale');

		if (window.webkitURL) {
			log('but window.webkitURL is available. Polyfilling window.URL');
			window.URL = window.webkitURL;
		}
	}

	function startApp() {
		log('Bootstrap angular');

		angular.element(document).ready(function () {
			angular.bootstrap(document, ['fun']);
		});
	}

	if ( ! window.FUN_VERSION) {
		window.FUN_VERSION = '-';
	}

	// if (sfLocal.remoteLogging) {
	// 	TraceKit.report.subscribe(function(error) {
	// 		Raven.captureException(error);
	// 	});
	// }

	var injector = angular.injector(['fun.services', 'ng']);
	var utils        = injector.get('Utils');

	if (utils.isCordovaApp()) {
		document.addEventListener('deviceready', function () {
			log('Event deviceready');

			setTimeout(function() {
				bootstrap();
				navigator.splashscreen.hide();
			}, 100);

		}, false);
	} else {

		$(function () {
			log('Event domready');

			bootstrap();
		});
	}

	function bootstrap() {

		var url, env;

		// serverUrl
		if (location.hostname === 'staging.stayfilm.com') {
			env = 'staging';
			url = sfLocal.serverUrlList[env];
		} else if (location.hostname === 'www.stayfilm.com') {
			env = 'prod';
			url = sfLocal.serverUrlList[env];
		} else if (location.hostname === 'julien.office.stayfilm.com.br') {
			env = 'julien';
			url = sfLocal.serverUrlList[env];
		} else {
			if (window.localStorage.serverUrl) {
				url = window.localStorage.serverUrl;
				env = window.localStorage.env;
			} else {
				env = sfLocal.defaultServer;
				url = sfLocal.serverUrlList[sfLocal.defaultServer];
			}
		}

		log('env', env, 'serverUrl', url);

		window.localStorage.serverUrl = url;
		window.localStorage.env = env;

		if (sfLocal.overloadCssUrl) {
			$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', sfLocal.overloadCssUrl) );
		}

		if (sfLocal.overloadJsUrl) {
			$.getScript(sfLocal.overloadJsUrl);
		}

		startApp();
	}
	
})();
