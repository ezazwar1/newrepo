angular.module('fun.services')
	.factory('MiscServ', function (
		CoolServ, $ionicModal, $rootScope, $ionicPopup, $ionicLoading, 
		SessionServ, SocialNetworkServ, ConfigServ, REQUIRED_STAYCOOL_WS_VERSION, 
		LogServ, ModalServ, $q, $timeout, Utils, SnServ, UserServ, $interval, 
		$state, FacebookServ, AuthServ, gettextCatalog, GaServ, $http, FbClientServ
	) {

		var log = LogServ;
		var imagesPreloaded = [];
		var imagePreloadUpdaters = [];
		var cacheGenres;
		var facebookReadyCallbacks = [];
		var facebookIsReady = false;
		var appInviteStatus;

		function invertTransition (transition) {
			if (transition == 'slide-left') {
				return 'slide-right';
			}

			if (transition == 'slide-right') {
				return 'slide-left';
			}

			if (transition == 'slide-up') {
				return 'slide-down';
			}

			if (transition == 'slide-down') {
				return 'slide-up';
			}
		}

		var stateTransitionMap = {};

		stateTransitionMap['main.home.feed'] = {};
		stateTransitionMap['main.home.feed']['main.home.gallery'] = 'slide-left';
		stateTransitionMap['main.home.feed']['main.moviemaker'] = 'slide-left';
		stateTransitionMap['main.home.feed']['main.home.notification'] = 'slide-left';
		stateTransitionMap['main.home.feed']['main.home.profile'] = 'slide-right';
		stateTransitionMap['main.home.feed']['main.home.friendship'] = 'slide-left';

		stateTransitionMap['main.home.gallery'] = {};
		stateTransitionMap['main.home.gallery']['main.home.feed'] = 'slide-right';
		stateTransitionMap['main.home.gallery']['main.moviemaker'] = 'slide-left';
		stateTransitionMap['main.home.gallery']['main.home.notification'] = 'slide-left';

		stateTransitionMap['main.home.gallery.latest'] = {};
		stateTransitionMap['main.home.gallery.latest']['main.home.gallery.bestof'] = 'slide-left';

		stateTransitionMap['main.home.gallery.genres'] = {};
		stateTransitionMap['main.home.gallery.genres']['main.home.gallery.bestof'] = 'slide-right';
		stateTransitionMap['main.home.gallery.genres']['main.home.gallery.genre'] = 'slide-left';

		stateTransitionMap['main.fbmessenger.titlestep'] = {};
		stateTransitionMap['main.fbmessenger.titlestep']['main.fbmessenger.mediastep'] = 'slide-left';

		stateTransitionMap['main.moviemaker.content'] = {
			'main.moviemaker.genre': 'slide-left'
		};

		stateTransitionMap['main.moviemaker.genre'] = {
			'main.moviemaker.theme': 'slide-left'
		};

		stateTransitionMap['main.moviemaker.theme'] = {
			'main.waiting': 'slide-left'
		};

		stateTransitionMap['main.fbmessenger.mediastep'] = {
			'main.waiting': 'slide-left'
		};

		stateTransitionMap['main.waiting'] = {
			'main.publish': 'slide-left',
			'main.fbmessenger.sharestep':'slide-left'
		};

		stateTransitionMap['main.albummanager.contentzone'] = {
			'main.albummanager.sourcezone': 'slide-left'
		};

		stateTransitionMap['main.home.notification'] = {};
		stateTransitionMap['main.home.notification']['main.home.feed'] = 'slide-right';
		stateTransitionMap['main.home.notification']['main.moviemaker'] = 'slide-right';
		stateTransitionMap['main.home.notification']['main.home.gallery'] = 'slide-right';
		stateTransitionMap['main.home.notification']['main.publish'] = 'slide-up';

		stateTransitionMap['main.moviemaker'] = {};
		stateTransitionMap['main.moviemaker']['main.home.feed'] = 'slide-right';

		stateTransitionMap['main.home.friendship.mate'] = {};
		stateTransitionMap['main.home.friendship.mate']['main.home.friendship.request'] = 'slide-right';

		stateTransitionMap['main.home.settings.personal'] = {};
		stateTransitionMap['main.home.settings.personal']['main.home.settings.credentials'] = 'slide-left';

		stateTransitionMap['main.home.profile'] = {};
		stateTransitionMap['main.home.profile']['main.home.feed'] = 'slide-left';
		stateTransitionMap['main.home.profile']['main.home.gallery'] = 'slide-left';
		stateTransitionMap['main.home.profile']['main.home.moviemaker'] = 'slide-left';
		stateTransitionMap['main.home.profile']['main.home.notification'] = 'slide-left';
		stateTransitionMap['main.home.profile']['main.home.settings'] = 'slide-right';

		stateTransitionMap['main.home.profile.movie'] = {};
		stateTransitionMap['main.home.profile.movie']['main.home.profile.like'] = 'slide-left';
		stateTransitionMap['main.home.profile.movie']['main.home.profile.pending'] = 'slide-left';

		stateTransitionMap['main.home.profile.pending'] = {};
		stateTransitionMap['main.home.profile.pending']['main.home.profile.like'] = 'slide-right';
		stateTransitionMap['main.home.profile.pending']['main.home.profile.movie'] = 'slide-right';

		stateTransitionMap['main.home.friend.movie'] = {};
		stateTransitionMap['main.home.friend.movie']['main.home.friend.like'] = 'slide-left';
		stateTransitionMap['main.home.friend.movie']['main.home.friend.mate'] = 'slide-left';

		stateTransitionMap['main.home.friend.mate'] = {};
		stateTransitionMap['main.home.friend.mate']['main.home.friend.like'] = 'slide-right';
		stateTransitionMap['main.home.friend.mate']['main.home.friend.movie'] = 'slide-right';

		var loadingTimeout;

		return {
			showLoading: function (msg, timeout, hideLoader) {

				log.debug('MiscServ.showLoading()', timeout);

				if ( ! msg) {
					msg = '';
				}


				if (hideLoader) {
					$ionicLoading.show({
						template: msg
					});
				} else {
					$ionicLoading.show({
						template: '<ion-spinner></ion-spinner> ' + msg
					});
				}

				if (loadingTimeout) {
					$timeout.cancel(loadingTimeout);
				}

				if (timeout !== false) { // cancel timeout = false 
					timeout = timeout || sfLocal.defaultTimeout;
				}

				if (timeout) {
					var cancelText = gettextCatalog.getString('Cancelar');

					loadingTimeout = $timeout(function () {
						$ionicLoading.show({
							template: '<ion-spinner></ion-spinner> ' + msg +
								'<br /><br /><div ng-controller="LoadingController"><a ng-click="close()"><span translate>&times; ' + cancelText + '</span></a></div>'
						});
					}, timeout);

				}
			},
			hideLoading: function () {

				log.debug('MiscServ.hideLoading()');

				$ionicLoading.hide();

				if (loadingTimeout) {
					$timeout.cancel(loadingTimeout);
				}
			},
			showQuickMessage: function (msg, hideTimeout, done) {
				this.hideLoading(); // avoid overlap with active loaders 

				$ionicLoading.show({ template: msg });
				
				$timeout(function(){
					$ionicLoading.hide();
					
					if (typeof done === 'function') {
						done();
					}

				}, hideTimeout || 2000);
			},
			getMovie: function (idmovie) {
				return CoolServ.get('movie/' + idmovie, {include: ['user', 'comment']});
			},
			showError: function (msg, e) {
				log.debug('MiscServ.showError()');

				$ionicLoading.show({template: msg});

				if (e) {
					log.error(e);
				}

				$timeout(function () {
					$ionicLoading.hide();
				}, 3000);
			},
			callInstagram: function (movie) {
				var self = this;
				var defer = $q.defer();
				var interval;
				var alreadyFinished = false;

				function shareEndInstagram (err) {
					log.debug('shareViaInstagram err', err);

					if (alreadyFinished) {
						return;
					}

					if (interval) {
						$interval.cancel(interval);
					}

					if (err) {
						defer.reject(err);
					} else {
						defer.resolve();
					}

					alreadyFinished = true;

					self.hideLoading();
				}
				
				if (window.shareViaInstagram) {
					var params = {
						idmovie: movie.idMovie,
						url: movie.baseUrl + '/video.mp4',
						title: movie.title
					};
					
					self.showLoading();
					
					window.shareViaInstagram(params, shareEndInstagram);

					var progressCheck = 0;

					interval = $interval(function () {
						window.checkDownloadProgress({ idmovie: movie.idMovie }, function (err, progress) {
							log.debug('download progress', progress);

							progress = parseInt(progress, 10);

							if (err) {
								log.error('Error in progress callback', err);
								return;
							}

							if (progress > progressCheck && progress <= 100) {
								progressCheck = progress;
								self.showLoading(' ' + progress + ' %');
							} else if (progress === -1) {
								shareEndInstagram(null);
							}
						});
					}, 1000);
				} else {
					defer.reject("Cannot shareViaInstagram");
				}

				return defer.promise;
			},
			callWhatsapp: function (movie) {
				var self = this;
				var defer = $q.defer();
				
				if (window.shareViaWhatsApp) {
					var params = {
						idmovie: movie.idMovie,
						url: movie.baseUrl + '/video.mp4',
						title: movie.title
					};
					
					self.showLoading();
					
					window.shareViaWhatsApp(params, function (err) {
						log.debug('shareViaWhatsApp err', err);

						if (err) {
							defer.reject(err);
						} else {
							defer.resolve();
						}

						self.hideLoading();
					});
				} else {
					defer.reject("Cannot shareViaWhatsApp");
				}

				/*
				window
					.plugins
					.socialsharing
					.shareViaWhatsApp (
						movie.title + ' on Stayfilm', // message
						null, // img
						movie.pageWatchUrl, // link url
						function() {
							defer.resolve();
						},
						function(err){
							defer.reject(err);
						}
					)
				;*/

				return defer.promise;
			},
			canShareVia: function (app) {

				var deferred = $q.defer();

				if ( ! window.plugins) {

					$timeout(function () {
						deferred.resolve(false);
					}, 0);

				} else {

					if (app === 'whatsapp') {
						window.plugins.socialsharing.canShareVia('whatsapp', 'msg', null, null, null,
							function(){
								deferred.resolve(true);
							}, function(){
								deferred.resolve(false);
							}
						);

					} else {
						deferred.reject('invalid app - ' + app);
					}
				}

				return deferred.promise;
			},
			cleanOldMovies: function () {
				if (typeof window.cleanOldMovies === 'function') {
					window.cleanOldMovies();
				}
			},
			getWsVersion: function () {
				var wsVersion = ConfigServ.get('cool_ws_version');

				if ( ! wsVersion) {
					wsVersion = ConfigServ.get('version');
				}

				return wsVersion;
			},
			handleTargetURL: function (targetURL) {
				log.debug('MiscServ.handleTargetUrl()', targetURL);

				window.localStorage.removeItem("targetURL");

				var page = Utils.getUrlInfo(targetURL, 'domain');

				var idmovie;

				log.debug('page', page);

				// if (SessionServ.isLogged()) {
					if (page === 'watch') {
						idmovie = Utils.getUrlInfo(targetURL, 'path').substr(1);

						$rootScope.watch(idmovie);

						log.debug('>>>>', $state);

						if ( ! $state.params.name) {
							$state.go('main.home.feed');
						}
					}
				// } else {
				// 	// store url for post login access
				// 	if (page === 'watch') {
				// 		idmovie = Utils.getUrlInfo(targetURL, 'path').substr(1);
				// 		var loadAfterLogin = page + "::" + idmovie;
				// 		console.log("AFTER LOGIN", loadAfterLogin);
				// 		window.localStorage.loadAfterLogin = loadAfterLogin;
				// 	}

				// 	$state.go('welcome.login');
				// }
			},
			loadAfterLogin: function () {
				var self = this;
				var parse = window.localStorage.loadAfterLogin;

				window.localStorage.removeItem("loadAfterLogin");
				
				var separator = "::";
				var isValid = parse.indexOf(separator) > -1;

				if (isValid) {
					var link = parse.split(separator);
					var page = link[0];
					var resource = link[1];

					if (page == "watch") {
						$rootScope.watch(resource);
					}
				}
		
				self.goTo('main.home.feed');
			},
			isVersionCompatible: function () {
				return true; // this is to fix quickly a bug in fbmessenger

				//var wsVersion = this.getWsVersion();
				//
				//var wsVersionString = wsVersion.split('-')[0];
				//var tmp  = wsVersionString.split('.');
				//
				//wsVersion = {major: parseInt(tmp[0], 10), minor: parseInt(tmp[1], 10)};
				//
				//tmp = REQUIRED_STAYCOOL_WS_VERSION.split('.');
				//var requiredVersion = {major: parseInt(tmp[0], 10), minor: parseInt(tmp[1], 10)};
				//
				//return wsVersion.major === requiredVersion.major && wsVersion.minor >= requiredVersion.minor;
			},
			search: function (str, types) {

				console.log(types);

				var params = {term: str, type: []};

				if (types && types.user) {

					params.type.push('user');

					if (types.user.limit) {
						params.userlimit = types.user.limit;
					}

					if (types.user.offset) {
						params.useroffset = types.user.offset;
					}
				}

				if (types && types.movie) {

					params.type.push('movie');

					if (types.movie.limit) {
						params.movielimit = types.movie.limit;
					}

					if (types.movie.offset) {
						params.movieoffset = types.movie.offset;
					}
				}

				return CoolServ.get('search', params);
			},
			filterMovieList: function filterMovieList(movies, newList) {
				var ids = {};

				angular.forEach(movies, function (val) {
					ids[val.idMovie] = true;
				});

				var filteredList = [];

				for (var i = 0; i < newList.length; i++ ) {
					var movie = newList[i];
					//log.debug(movies.length, newList[i].idMovie, movies[0])

					if (ids[movie.idMovie]) {
						break;
					}

					filteredList.unshift(movie);
				}

				return filteredList;
			},
			popAuth: function (sn) {

				var url = CoolServ.getBaseUrl() + '/network/' + sn + '/?deviceType=mobile&idsession=' + SessionServ.getIdSession();

				log.info('url', url);

				var options = [];
					
				// in device
				if (Utils.isCordovaApp()) {
					log.debug("MiscServ::ANDROID or IOS");

					var deferred = $q.defer();

					options.push('location=yes');
					options.push('closebuttoncaption=Close');
					options.push('hidden=no');
					options.push('clearsessioncache=no');
					options.push('disallowoverscroll=no');

					var frob;

					var w = window.open(url, '_blank', options.join(','));

					w.addEventListener('exit', function () {
						log.info('window has been closed');

						if (frob) {
							deferred.resolve(frob);
						} else {
							deferred.reject();
						}
					});

					w.addEventListener('loadstart', function(e) {
						console.log('loadStart');

						var url = e.url;

						log.debug(url);

						var match = url.match(/(code|frob)=([^&]*)/);

						log.debug('match', match);

						if (match) {
							frob = match[2];
							w.close();
						} else if (url.match(/oauth_token/)) {

							log.debug('twitter');

							// http://www.stayfilm.com/rest/network/twitter?oauth_token=Vnm4KMLxJA1HeuE1vyNJkv8TbjV5WMNy&oauth_verifier=nj3DPKsQfd7Fr2gkCGJR19Iz2JqItKEm

							var matchOauthToken = url.match(/(oauth_token)=([^&]*)/);

							var oauthToken = matchOauthToken.pop();

							var matchVerifier = url.match(/(oauth_verifier)=([^&]*)/);

							var oauthVerifier = matchVerifier.pop();

							frob = oauthToken + ':' + oauthVerifier;

							log.debug('twitter frob', frob);

							w.close();
						}

						match = url.match(/error_reason/);

						if (match) {
							w.close();
						}

						match = url.match(/www\.flickr\.com\/?$/);

						if (match) {
							w.close();
						}
					});

					return deferred.promise;

				} else { // in browser
					console.log("BROWSER");

					options = { width: 800, height: 500, sn: sn };

					return this.oauthpopup(url, options);
				}
			},
			oauthpopup: function (path, options) {

				var deferred = $q.defer();

				options.windowName = options.windowName || 'ConnectWithOAuth';

				options.windowOptions = options.windowOptions || 'location=0,status=0,width=' + options.width + ',height=' +
					options.height + ',scrollbars=1,left=' + (screen.width-options.width)/2 + ',top=' + (screen.height-options.height)/2;

				var sn = options.sn;

				if ( ! window.frobs) {
					window.frobs = {};
				}

				var popup = window.open(path, options.windowName, options.windowOptions);

				$(window).on("focus.return", function(){
					console.log("back from popup");
					// / close ajaxloader (legacy setInterval does it)

					// / fechar o popup
					popup.close();

					// / retirar o bind
					$(this).unbind("focus.return");
				});

				if ( ! popup) {
					alert('Por favor, desative o bloqueador de popup');
					return;
				}

				var interval = window.setInterval(function () {

					if (popup.closed) {
						window.clearInterval(interval);

						if (window.frobs[sn]) {
							log.info("POPUP SUCCESS");
							deferred.resolve(window.frobs[sn].replace(/{{|}}/g, ''));
						} else {
							log.info("POPUP ERROR");
							deferred.reject();
						}
					}
				}, 1000);

				return deferred.promise;

			},
			toggleNetwork: function (network, permissions) {
				log.info("toggleNetwork() ", network, permissions);

				var self = this;

				var deferred = $q.defer();

				var integratedNetworks = SessionServ.getNetworks();

				if (integratedNetworks[network]) {
					log.info('is integrated - just toggle');

					if (permissions && (network !== 'facebook')) {
						throw new Error('network should facebook when permissions asked');
					}

					if (permissions) {

						SnServ.hasPermissions(network, permissions)
							.then(
								function (resp) {

									if (resp.data.hasPermissions) {

										deferred.resolve();

									} else {
										FacebookServ.join(permissions)
											.then(
												function () {
													deferred.resolve();
												},
												function () {
													deferred.reject();
												}
											)
										;
									}
								},
								function (err) {
									log.debug(err);
									deferred.reject(err);
								}
							)
						;
					} else {

						$timeout(function () {
							deferred.resolve();
						}, 100);
					}

				} else {

					log.info("not integrated() " + network);

					if (network !== 'facebook') {

						self.popAuth(network)
							.then(
								function (frob) {

									log.info('frob', frob);

									UserServ.createToken(SessionServ.getUsername(), network, frob)
										.then(
											function () {
												SessionServ.addSn(network);
												deferred.resolve();
											},
											function () {
												deferred.reject('Unable to  create the token from frob - ' +  frob);
											}
										)
									;
								},
								function error() {
									deferred.reject('Popoauth promise rejected.');
								}
							);

					} else { //facebook

						FacebookServ.join(permissions)
							.then(
								function () {
									deferred.resolve();
								},
								function (code) {

									deferred.reject(code);

									log.info("SN CODE", code);
								}
							)
						;
					}
				}

				return deferred.promise;
			},
			alert: function (msg, title) {
				return $ionicPopup.alert({
					title: title,
					template: msg
				});
			},
			isVideo: function (file) {
				log.debug('MiscServ.isVideo()', file);

				var
					videoTypes = ConfigServ.get('video_extensions'),
					fileType,
					parts;

				if (angular.isString(file)) {
					// file is a url

					// Currently on Android, there is no safe way to distinguish between VIDEO and IMAGE,
					// but often, they're identified through "video:SOMETHING", so it's good for now

					// Android 4.4+ content://com.android.providers.media.documents/document/video%3A21761 
					// Android <4.4 content://media/external/images/media/62

					return file.indexOf("video") > -1;
					
				} else {
					parts = file.name.split('.');

					if (parts.length < 2) {
						return false;
					}

					fileType = parts.pop().toLowerCase();
				}

				log.debug('fileType', fileType);

				return _.contains(videoTypes, fileType);
			},
			isFileValidForUpload: function (file) {

				log.debug('MiscServ.isFileValidForUpload()');

				var imageTypes = ['jpg', 'png'],
					videoTypes = ConfigServ.get('video_extensions'),
					fileType,
					parts,
					maxSize = ConfigServ.get('upload_image_max_size') || 10 * 1024 * 1024; // 3MB;

//				if (file.type) { // mime
//					parts = file.type.split('/');
//
//					if (parts.length > 1) {
//						fileType = parts.pop();
//					}
//				}

				if ( ! fileType) {
					parts = file.name.split('.');

					if (parts.length < 2) {
						return false;
					}

					fileType = parts.pop().toLowerCase();
				}

				var types = imageTypes.concat(videoTypes);

				return _.contains(types, fileType) &&  file.size < maxSize;
			},
			getTransition: function (fromState, toState, inverted) {

				if ( ! fromState) {
					return;
				}

				var fromParts = fromState.split('.'),
					from,
					fromStr,
					toStr,
					toParts,
					transition
				;

				while (fromParts.length) {
					fromStr = fromParts.join('.');

					if (stateTransitionMap[fromStr]) {
						from = stateTransitionMap[fromStr];

						if (from) {
							toParts = toState.split('.');

							while (toParts.length) {
								toStr = toParts.join('.');

								if (from[toStr]) {
									transition = from[toStr];
									break;
								} else {
									toParts.pop();
								}
							}
						}
					}

					if (transition) {
						break;
					} else {
						fromParts.pop();
					}
				}

				if ( ! inverted && ! transition) {
					transition = this.getTransition(toState, fromState, true);
					transition = invertTransition(transition);
				}

				log.debug('transition', transition);

				return transition;
			},
			addTransitionClass: function (transition, toState, toParams, fromState) {

//				log.debug('addTransitionClass()');
//				log.debug(arguments);

				$('ui-view').removeClass('no-transition slide-left slide-right slide-up slide-down slide-on-top-from-right');

				var lastSegmentOffset = 0;

				var i = 0;

				if (fromState !== toState) {
					while (fromState[i] === toState[i]) {

						if (toState[i] === ".") {
							lastSegmentOffset = i;
						}

						i++;
					}
				}

				if (lastSegmentOffset > 0) {
					var className =  fromState.substr(0, lastSegmentOffset).replace(/\./g, '-');

					var parent = $('.' + className).parents('ui-view').first();

					if ( ! transition) {
						transition = 'no-transition';
					}

					parent.addClass(transition);
				}

			},
			goTo: function (toState, transition, params, options) {
				log.debug('goTo()', toState, options);

				var transformedTag = GaServ.transformTags.apply(this, arguments);
				var tagView = transformedTag || toState;

				console.log("tagView", tagView);

				GaServ.stateView(tagView);

				$state.go(toState, params, options);
			},
			loginWithFacebook: function (permissions) {
				log.info('MiscServ.loginWithFacebook()');

				var deferred = $q.defer();

				var self = this;

				FacebookServ
					.getToken(permissions)
					.then(
						function (token) {

							log.debug('MiscServ.loginWithFacebook::token', token);

							if (token) {

								self.loginWithToken(token).then(function (resp) {
									log.debug('MiscServ.loginWithFacebook::loginWithToken success cb', resp);

									FbClientServ.setToken(token);

									deferred.resolve(resp);
								}, function (err) {
									log.debug('MiscServ.loginWithFacebook::loginWithTOken error cb', err);
									deferred.reject(err);
								});

							} else {
								deferred.reject();
							}
						},
						function error (err) {
							deferred.reject(err);
						}
					)
				;

				return deferred.promise;
			},
			loginWithToken: function (token) {
				log.info('MiscServ.loginWithToken()');

				var deferred = $q.defer();

				var self = this;

				AuthServ
					.loginWithToken(token)
					.then(
						function (userExists) {

							if ( ! userExists) {

								log.info('user does not exist, create ! Token ' + token );

								self.showLoading(gettextCatalog.getString('Criando a sua conta...'));

								UserServ.register({facebookToken: token})
									.then(
										function success(resp) {

											log.debug('response from UserServ.register()', resp);

											AuthServ.loginWithToken(token).then(function () {

												self.hideLoading();
												
												deferred.resolve('register');

											}, function (err) {
												deferred.reject(err);
												self.hideLoading();
												//MiscServ.showError('erro de login', err);
											});
										},
										function error(err) {
											log.error('erro de register', err);

											self.hideLoading();

											deferred.reject(err);
										}
									)
								;
							} else {

								deferred.resolve('login');
							}

						}, function (e) {
							deferred.reject(e);
						}
					)
				;

				return deferred.promise;

			},
			getGenreTerms: function (campaignSlug, genreSlug) {

				var params = {
					genre: genreSlug,
					campaign: campaignSlug,
					language: SessionServ.getLang()
				};

				return CoolServ.get("term", params);
			},
			getLocalizedTerms: function () {
				var defer = $q.defer(),
					lang = SessionServ.getLang();

				if (lang === 'es') { // temporary fix until spanish is available
					lang = 'en';
				}

				$http.get('src/pages/institutional/terms-' + lang + '.html')
					.success(function(data) {
						log.debug("SUCCESS getLocalizedTerms get terms");

						defer.resolve(data);
					})
					.error(function(data) {
						log.error("ERROR getLocalizedTerms get terms");

						defer.reject(data);
					})
				;

				return defer.promise;
			},
			getLocalizedPrivacyTerms: function () {
				var defer = $q.defer(),
					lang = SessionServ.getLang();

				if (lang === 'es') { // temporary fix until spanish is available
					lang = 'en';
				}

				$http.get('src/pages/institutional/privacy-' + lang + '.html')
					.success(function(data) {
						log.debug("SUCCESS getLocalizedPrivacyTerms get privacy");

						defer.resolve(data);
					})
					.error(function(data) {
						log.error("ERROR getLocalizedPrivacyTerms get privacy");

						defer.reject(data);
					})
				;

				return defer.promise;
			},
			registerPreloadImage: function () {
				var src = this.src;
				console.log("PRELOADED>>>>>>>> ", src);

				imagesPreloaded[src] = true;
				
				imagePreloadUpdaters.forEach(function (updater) {
					updater(src);
				});
			},
			registerErrorPreloadImage: function () {
				console.log("ERROR-PRELOADED>>>>>>>> ", this.src);
				imagesPreloaded[this.src] = false;
			},
			isPreloaded: function (url) {
				return imagesPreloaded[url];
			},
			registerImagePreloadUpdater: function (updater) {
				imagePreloadUpdaters.push(updater);
			},
			cacheGenres: function (genres) {
				if (genres) {
					cacheGenres = genres;
				}
			},
			getCacheGenres: function (genres) {
				return cacheGenres;
			},
			registerFacebookReady: function () {
				log.debug('registerFacebookReady()');
				facebookIsReady = true;
				if (facebookReadyCallbacks.length) {
					facebookReadyCallbacks.forEach(function (handler) {
						handler();
					});
				}
			},
			whenFacebookReady: function (done) {
				log.debug('whenFacebookReady()');
				if (facebookIsReady) {
					done();
				} else {
					facebookReadyCallbacks.push(done);
				}
			},
			appInviteStatus: function (status) {
				if (typeof status != "undefined") { // set
					appInviteStatus = status;
				} else { // get
					return appInviteStatus;
				}
			}
		};
	})
;
