angular.module('fun').run(function (
	$rootScope, AuthServ, $state, SessionServ, $timeout, ModalServ, 
	MiscServ, $ionicActionSheet, CoolServ, ProfileModal, $ionicPopup, 
	MaintenanceServ, StorageServ, Utils, ConfigServ, LogServ, 
	REQUIRED_STAYCOOL_WS_VERSION, FUN_VERSION, $ionicScrollDelegate, 
	$urlRouter, gettextCatalog, NotificationServ, $stateParams, 
	$ionicPlatform, RoutingServ, GaServ, PushServ, MovieServ
) {
		(function treatIncomingURL(url) {
			if ( ! url) {
				return;
			}

			console.log("IncomingURL", url );

			url = url.substr(2);
			var dataBoundary = url.indexOf("/");
			var resource = url.substr(0, dataBoundary);
			var data = url.substr(++dataBoundary);

			console.log("IncomingURL::resource", resource);
			console.log("IncomingURL::data", data);

			if (resource && data) {
				if (resource == 'incomingwatch') {
					// - injetar no localstorage
					console.log("IncomingURL::ACTIVATED");
					window.localStorage.targetURL = 'watch/' + data;
				}
			}
		})(window.location.hash);

		var log = LogServ;

		if (sfLocal.lang) {
			console.log("sfLocal.lang", sfLocal.lang);
			SessionServ.setLang(sfLocal.lang);
		}

		$rootScope.funVersion = FUN_VERSION;

		$rootScope.debug = window.localStorage.debug ? true : false;

		sfLocal.facebookAppId = sfLocal.appContext === 'fbmessenger' ? sfLocal.facebookAppIds.fbmessenger : sfLocal.facebookAppIds.stayfilm;

		log.debug('appContext', sfLocal.appContext);
		log.debug('sfLocal', sfLocal);

		log.info('Fun:run()');

		// this function has to be declared very early.
		// Don't move it down.
		$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

			log.debug('rootScope - $stateChangeStart');

			if (CoolServ.isMaintenance() && toState.name !== 'welcome.maintenance') {
				event.preventDefault();
				return $state.go('welcome.maintenance');
			}

			if ( ! CoolServ.isMaintenance() && toState.name === 'welcome.maintenance') {
				event.preventDefault();
				return $state.go('main.home.feed');
			}

			var result = RoutingServ.executeCb(toState);

			log.debug('result', result);

			if (result === true) {

				// default behaviour

			} else if (result === false) {
				event.preventDefault(); // cancel state change
				return;
			} else { // result is a stateName
				toState = $state.get(result);

				log.debug('toState', toState.name);

				if ( ! toState) {
					throw new Error('invalid state: ' + toState.name);
				}

				RoutingServ.deregisterCb();
				event.preventDefault();
				$state.go(toState.name);
			}

			if ( ! AuthServ.isAuthorized(toState.access)) {
				$rootScope.error = "Seems like you tried accessing a route you don't have access to...";
				event.preventDefault();

				if (sfLocal.appContext === 'fbmessenger') {
					//$state.go('sandbox.test');
					$state.go('welcome.startfb');
				} else {
					$state.go('welcome.start');
				}

				return;
			}

			var transition = MiscServ.getTransition(fromState.name, toState.name);

			MiscServ.addTransitionClass(transition, toState.name, toParams, fromState.name, fromParams);

			log.debug('From:', fromState.name, 'toState:', toState.name);
		});

		$rootScope.switchServer = function () {
			var envList = [];

			angular.forEach(sfLocal.serverUrlList, function (val, key) {
				envList.push(key);
			});

			log.debug('available env:', envList);

			var env;

			while ( ! env) {

				env = window.prompt("Please choose your environment (Possible values: " + envList.join(', '), window.localStorage.getItem('env'));

				if (envList.indexOf(env) === -1) {
					env = null;
				}
			}

			window.localStorage.serverUrl = sfLocal.serverUrlList[env];
			window.localStorage.env = env;
			location.reload();
		};

		// an hidden button to show javascript logs where we are
		$('.btn-show-log').click(function () {
			var modal = ModalServ.get('log');
			modal.show();
		});

		// code to deal with retractil header while scrolling through lists
		var scrollData = {};

		$rootScope.$on('$stateChangeSuccess', function () {
			scrollData = {};
		});

		$rootScope.onScroll = function () {

			var o = scrollData;

			if (o.timer) {
				return;
			}

			o.timer = $timeout(function () {
				o.timer = null;
			}, o.timeOut || 1000);

			o.currentTop = $ionicScrollDelegate.getScrollPosition().top;

			if ( ! o.timeOut) {
				o.hideNavigation = o.currentTop > 100;
			} else {
				o.hideNavigation = o.currentTop > 100 && (o.currentTop - o.lastTop) > 0;
			}

			o.lastTop = o.currentTop;
			o.currentTop = null;

			o.timeOut = o.hide !== o.hideNavigation ? 1000 : 200 ;

			if ( ! o.retractileNodes) {
				o.retractileNodes = $('.bar-retractile');
			}

			if (o.hideNavigation) {
				o.retractileNodes.addClass('bar-retractile-enabled');
			} else {
				o.retractileNodes.removeClass('bar-retractile-enabled');
			}

			o.hide = o.hideNavigation;
		};

		// for android back button
		$ionicPlatform.registerBackButtonAction(function () {
			log.info('registerBackButtonAction app.run history.back()');
			history.back();
		}, 101);

		$rootScope.showLogPopup = function () {
			var m = ModalServ.get('log');
			m.show();
		};

		$rootScope.goTo = function (toState, transition, params, options) {
			MiscServ.goTo(toState, transition, params, options);
		};

		$rootScope.updateNotifCount = function () {

			log.debug('updateNotifCount()');

			NotificationServ.getNewCount().then(function (count) {

				$rootScope.newNotificationCount = count;

			}, function () {
				log.warn('error while fetching notifation count');
			});
		};

		$rootScope.$on("$stateChangeError", function () {
			MiscServ.hideLoading();
			var isAdmin = SessionServ.getUser() && SessionServ.getUser().role === 'admin';

			log.error(" > $stateChangeError", arguments);

			if (isAdmin) {
				var modal = ModalServ.get('info');
				modal.show(arguments);
			}
		});

		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			log.debug('$stateChangeSuccess');

			if(window.Stayalert) {
				window.Stayalert.setCurrentState(toState.name);
			}
			
			$rootScope.currentState = toState.name;
			$rootScope.prevState = fromState.name;
			$rootScope.fromState = fromState.name ? fromState : null;
			$rootScope.fromStateParams = fromParams;
			$rootScope.prevStateParams = fromParams;
		});

		$rootScope.watch = function (idmovie) {
			console.log("WATCH: " + idmovie);

			MiscServ.showLoading();

			MiscServ.getMovie(idmovie).then(function (movie) {

				MiscServ.hideLoading();

				console.log(movie);

				if (movie.status !==  1) { // active
					$rootScope.goTo('main.publish', null, {idmovie: movie.idMovie});
					return;
				}

				var modal = ModalServ.get('watch');
				modal.show({movie: movie});

			}, function (e) {
				MiscServ.hideLoading();
				log.error('Error when fetching movie', e);

				MiscServ.showQuickMessage(gettextCatalog.getString('Filme indisponível :('), 2000);
			});
		};

		// window.watchNow = $rootScope.watch;
		$rootScope.watchNow = window.watchNow = function (idmovie) {
			if ( ! idmovie) return;


			MiscServ.getMovie(idmovie).then(function (movie) {

				console.log(">>>>>>>>>>>>>>>>", movie);

				if (movie.status !==  1) { // active
					$rootScope.goTo('main.publish', null, {idmovie: movie.idMovie});
					return;
				}

				MovieServ.setCache(movie);

				$state.go('welcome.watch', {idmovie: idmovie}, {reload: true});

			}, function (e) {
				MiscServ.hideLoading();
				log.error('Error when fetching movie', e);

				MiscServ.showQuickMessage(gettextCatalog.getString('Filme indisponível :('), 2000);
			});
		};

		$rootScope.todo = function () {
			$ionicPopup.alert({
				title: 'Not ready yet !',
				content: 'Just be patient, Cabra da peste !'
			});
		};

		$rootScope.showError = function (msg, params) {
			log.error(msg, params);
			$ionicPopup.alert({title: msg, template: JSON.stringify(params)});
		};

		$rootScope.ProfileModal = ProfileModal;

		// This is not working, the right one is in bootstrap.js
		// if (Utils.isCordovaApp() && sfLocal.appContext !== 'fbmessenger') {
		// 	log.debug('Add event listener push-notification');
		// 	PushServ.initPushwoosh();
		// }

		ConfigServ.init();
		SessionServ.init();
		SessionServ.initLanguage();

		setTimeout(function(){ // delay fix for GA plugin
			GaServ.init();
		}, 3000);

//		MaintenanceServ.init();

		if ( ! window.downloadMovieToDevice) {
			window.downloadMovieToDevice = function (params, done) {
				log.debug('FAKE downloadMovieToDevice(params,done)', params, done);
				$timeout(function () {
					done(null, params.url);
				}, 10);
			};
		}

		ConfigServ.updateConfig().then(function () {
			SessionServ.checkSession();

			// config stayalert
			if (window.Stayalert) {
				window.Stayalert.setActive(ConfigServ.get('stayalert_active'));
				window.Stayalert.setUrl(ConfigServ.get('stayalert_url'));
			}

			if (Utils.isCordovaApp()) {
				var facebookPluginVerifier;
				facebookPluginVerifier = setInterval(function () {
					if (window.facebookConnectPlugin) {
						clearInterval(facebookPluginVerifier);
						MiscServ.registerFacebookReady();
					} else {
						log.debug("facebookConnectPlugin not available yet");
					}
				}, 500);
			} else {
				Utils.initFB(ConfigServ.get('fb_app_id'), MiscServ.registerFacebookReady);
			}

			if ( ! MiscServ.isVersionCompatible()) {
				log.debug('WS version not compatible');
			}

			// if app was closed and opened by deeplink
			if (ConfigServ.get('deep_link_active') && window.localStorage.targetURL) {
				log.debug("TARGET_URL FOUND!", window.localStorage.targetURL);
				event.preventDefault();
				
				MiscServ.handleTargetURL(window.localStorage.targetURL);
			}

			document.addEventListener('resume', function () {
				log.debug('resume application');

				if (ConfigServ.get('deep_link_active')  && sfLocal.appContext !== 'fbmessenger') {
					// we listen for the resume event. If there is something in the localStorage
					// we handle that url
					log.debug('targetUrl', window.localStorage.targetUrl);

					if (window.localStorage.targetURL) {
						MiscServ.handleTargetURL(window.localStorage.targetURL);
					}
				}

			}, false);
			
			(function preloadImages () {
				var imageUrl;

				var genres = ConfigServ.get('fun_moviemaker_genre_list', 'config');

				console.log("#### GENRES #### >", genres);

				var img;
				for (var i = 0; i < genres.length; i++) {
					imageUrl = genres[i].imageUrl;
					console.log("imageUrl", imageUrl);
					img = new Image();
					img.onload = MiscServ.registerPreloadImage;
					img.onerror = MiscServ.registerErrorPreloadImage;
					img.src = imageUrl;
				}

			})();

		}, function (error) {
			log.debug('das');

			if (error.statusCode === 0 || error.statusCode === 503) {
				log.debug('internet down');
			} else {
				console.log('expected error occured! Please try late !');
			}
		});

		MiscServ.cleanOldMovies();
	})
	.directive('errSrc', function() {
		return {
			link: function(scope, element, attrs) {
				element.bind('error', function() {
					element.attr('src', attrs.errSrc);
				});
			}
		};
	})
;
