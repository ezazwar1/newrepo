angular.module('fun.services')
	.factory('PushServ', function ($rootScope, LogServ, MiscServ, Utils, StorageServ, CoolServ, sfGrowl, ConfigServ) {
		var log = LogServ;
		var pushNotification;

		return {
			initPushwoosh: function initPushwoosh() {
				var pushEnabled = ConfigServ.get('fun_enable_push_notification');
				log.debug('initPushwoosh() fun_enable_push_notification', pushEnabled);

				if ( ! pushEnabled) {
					log.debug('initPushwoosh() PUSH DISABLED. Skip push.');
					return;
				}

				if (Utils.isCordovaApp() && sfLocal.appContext !== 'fbmessenger') {
					log.debug('initPushwoosh() Push context OK: not fbmessenger, is device.');
				} else {
					log.debug('initPushwoosh() NOT Push context. Skip push.');
					return;
				}

				if (window.plugins && window.plugins.pushNotification) {
					log.debug('window.plugins.pushNotification IS AVAILABLE');
					pushNotification = window.plugins.pushNotification;
				} else {
					log.debug('window.plugins.pushNotification NOT AVAILABLE');
				}

				if (typeof pushNotification === "undefined") {
					log.debug('Plugin PushWoosh is not installed. Skip Push notification');
					return;
				}

				var self = this;

				document.addEventListener('push-notification', function(event) {
					self.process(event);
				});

				if (ConfigServ.getEnv() != 'prod') {
					sfLocal.pushWooshId = sfLocal.pushWooshIdTest || sfLocal.pushWooshId;
					log.debug('Pushwoosh TEST Sandbox environment activated: ' + sfLocal.pushWooshId);
				}


				log.debug('Pushwoosh Register: ' + sfLocal.pushWooshId);

				//initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
				pushNotification.onDeviceReady({ projectid: sfLocal.googleProjectId, appid : sfLocal.pushWooshId, pw_appid: sfLocal.pushWooshId});

				//register for pushes
				pushNotification.registerDevice(
					function(registered) {
						var deviceToken;

						if (registered.pushToken) {
							deviceToken = registered.pushToken; // modified AGAIN api fpushwoosh

						} else if (registered.deviceToken) {
							deviceToken = registered.deviceToken; // modified api

						} else {
							deviceToken = registered; // original api
						}

						log.info('push registered: ' + registered);
						log.info('registerDevice: ' + deviceToken);

						StorageServ.set('deviceToken', deviceToken, 'permanent');
					},
					function(status) {
						log.info('failed to register : ' + JSON.stringify(status));
					}
				);

				document.addEventListener("resume", function () {
					log.info('Application resumed');

					pushNotification.setApplicationIconBadgeNumber(0);
				} , false);

				// reset badges on app start
				pushNotification.setApplicationIconBadgeNumber(0);
			},
			process: function (event) {
				log.debug('PushServ.process()', event);

				var self = this,
					notif = event.notification,
					notifData = notif.userdata || notif.u
				;

				log.debug('notifData', notifData);
				
				$rootScope.updateNotifCount();

				if ( ! notifData) {
					log.error("ERROR: No valid userdata was found, aborting processing of notification");
					return; // avoid invalid notifications
				}

				var showImmediately = notif.onStart,
					idpush = notifData.id,
					notifTitle
				;

				if (notif.title) {
					notifTitle = notif.title;
				} else if (notif.aps && notif.aps.alert) {
					notifTitle = notif.aps.alert;
				} else {
					notifTitle = 'new notification';
				}

				log.debug('notifTitle', notifTitle);

				log.debug('idpush', idpush);

				//clear the app badge
				pushNotification.setApplicationIconBadgeNumber(0);

				self.getNotification(idpush).then(function success (notification) {
					log.debug("notification body: ", notification);

					if (showImmediately) {

						log.debug('show immediately');

						self.executeNotification(notification);

					} else {
						log.debug('do not show immediately, use growl', idpush);

						sfGrowl.show({message:notifTitle}, function () {
							self.executeNotification(notification);
						});
					}
				}, function fail (err) {
					log.error("failed to get notification body: ", err);
					// do nothing if can't get the notif
				});

			},
			executeNotification: function (notification) {

				log.debug('executeNotification()');

				var idmovie;

				switch (notification.type) {
					case 'movie-created':
						idmovie = notification.movie.idMovie;

						log.debug('idmovie', idmovie);

						if ( ! idmovie) {
							throw new Error('idmovie missing in notification');
						}

						MiscServ.goTo('main.publish', null, {idmovie: idmovie});

						break;

					case 'movie-comment':
					case 'movie-like':
					case 'movie-shared':
					case 'user-quoted':
					case 'movie-approved':

						idmovie = notification.movie.idMovie;

						log.debug('idmovie', idmovie);

						if ( ! idmovie) {
							throw new Error('idmovie missing in notification');
						}

						$rootScope.watch(idmovie);

						break;

					case 'friendship-accepted':
					case 'friendship-request':
					case 'friend-registered':

						var username = notification.user.username;

						log.debug('username', username);

						if ( ! username) {
							throw new Error('username missing in notification');
						}

						MiscServ.goTo('main.home.friend.movie', null, {username: username});

						break;

					default:
						log.debug('Notification invalid type ', notification.type);
						// do nothing

				}
			},
			getNotification: function (idpush) {
				log.debug("idpush: ", idpush);

				return CoolServ.get('pushnotification/' + idpush).then(function (resp) {
					return resp.data;
				});
			}
		};
	});
