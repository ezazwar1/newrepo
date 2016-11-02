angular.module("ionic.metApp", ['ionic', 'ionic.service.core', 'ionic.metApp.services', 'ionic.metApp.directives', 'ionic.metApp.routes',
	'ngCordova', 'ngResource', 'ngIOS9UIWebViewPatch', 'ngRoute', 'ngMap', 'angularMoment'
])

.constant('resources', (function() {
	return {
		// apiUrl: '/api',
		apiUrl: 'http://190.58.130.230/api',
		FORECASTIO_KEY: '4cd3c5673825a361eb5ce108103ee84a',
		FLICKR_API_KEY: '504fd7414f6275eb5b657ddbfba80a2c'
	}
})())

.run(['$ionicGesture', '$cordovaSplashscreen', 'IonicClosePopupService', '$ionicPopup', '$cordovaNetwork', '$cordovaToast', 'resources', '$http', '$cordovaPush', '$ionicPlatform', '$rootScope', '$ionicLoading', '$cordovaDialogs', '$state', 'metApi', '$timeout', '$ionicSideMenuDelegate',
	function($ionicGesture, $cordovaSplashscreen, IonicClosePopupService, $ionicPopup, $cordovaNetwork, $cordovaToast, resources, $http, $cordovaPush, $ionicPlatform, $rootScope, $ionicLoading, $cordovaDialogs, $state, metApi, $timeout, $ionicSideMenuDelegate) {
		$rootScope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
		$rootScope.apiUrl = resources.apiUrl;
		// $cordovaSplashscreen.show();
		if (ionic.Platform.isAndroid()) {
			$rootScope.isAndroid = true;
		}

		// metApi.get_tokens(function(data) {
		// console.debug('all device tokens', data)
		// console.debug('met subscribe response', data);
		// metApi.unsubscribe(function(data) {
		//     console.log('all tokens cleared');
		// })
		// });

		$rootScope.$on('loading:show', function() {
			$rootScope.showingOverlay = true;
			$ionicLoading.show({
				template: ' <ion-spinner class="light" icon="ripple"></ion-spinner>'
			});

			if ($rootScope.showingOverlay) {
				$timeout(function() {
					var el = angular.element(document.querySelector('.loading'));
					tapGesture = $ionicGesture.on('tap', function(evt) {
						$ionicLoading.hide();
						$ionicGesture.off(tapGesture, 'tap');
						$rootScope.showingOverlay = false;
					}, el);
				}, 50)
			}
		})
		$rootScope.$on('loading:hide', function() {
			$ionicLoading.hide();
			$rootScope.showingOverlay = false;
		})
		$ionicPlatform.ready(function() {

			if (window.cordova) {
				$rootScope.has_data_timer();
				// $timeout(function() {
				// 	navigator.splashscreen.hide();
				// }, 1000);
			}

			if (window.StatusBar) {
				StatusBar.styleLightContent();
			}
			// navigator.splashscreen.hide();
		});

		// set up push notifications on onesignal platform
		$ionicPlatform.on("deviceready", function() {

			// Enable to debug issues.
			// window.plugins.OneSignal.setLogLevel({
			// 	logLevel: 4,
			// 	visualLevel: 4
			// });

			var notificationOpenedCallback = function(notification) {
				handleOpenNotification(notification);
				// console.debug('didReceiveRemoteNotificationCallBack: ', notification);
			};

			window.plugins.OneSignal.init("adf41f9d-3404-4a7e-8903-0b84cfc69a68", {
					googleProjectNumber: "158386410361"
				},
				notificationOpenedCallback);

			// Show an alert box if a notification comes in when the user is in your app.
			window.plugins.OneSignal.enableInAppAlertNotification(false);
		}, false);

		function handleOpenNotification(notification) {
			$cordovaDialogs.confirm(notification.message, 'TT Met Office').then(function(buttonIndex) {
				var btn = buttonIndex;
				if (btn == 1) {
					var p = 0;
					if (notification.additionalData.slide == "Information" || notification.additionalData.slide == "WATCH") {
						p = 0;
					}
					if (notification.additionalData.slide == "Severe Weather" || notification.additionalData.slide == "WARNING") {
						p = 1;
					}
					if (notification.additionalData.slide == "Flood") {
						p = 2;
					}
					if (notification.additionalData.slide == "Rough Sea") {
						p = 3;
					}
					$state.go('app.' + notification.additionalData.state, {
						id: p
					});
				}
			});
		}

		$rootScope.doToast = function(toastMsg, duration, position) {
			var d = duration ? duration : 'short';
			var p = position ? position : 'bottom';
			$cordovaToast.show(toastMsg, d, p).then(function(success) {
				// success
			}, function(error) {
				// error
			});
		}

		$rootScope.has_data_timer = function() {
			var isOnline = $cordovaNetwork.isOnline();
			$timeout(function() {
				if (!isOnline) {
					$rootScope.doToast('You are offline. Cannot fetech new data.');
				}
			}, 5 * 60 * 1000)
		}

		$rootScope.doAlert = function(title, subtitle) {
			var alertPopup = $ionicPopup.alert({
				template: title + (subtitle ? subtitle : ''),
				cssClass: 'aws_popup',
				// okText: 'Close'
			});
			IonicClosePopupService.register(alertPopup);
			$timeout(function() {
				alertPopup.close();
			}, 3000);
		}

	}
]);
