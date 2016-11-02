	angular.module('underscore', [])
	.factory('_', function() {
		return window._; 
	});
	angular.module('photoshare', ['ionic.contrib.drawer','ionic',
		'LocalStorageModule','btford.socket-io','angularMoment','ngCordova', 
		'ion-floating-menu'])

	.run(function($ionicPlatform,$rootScope,$cordovaNetwork,ConnectivityMonitor) {
		$ionicPlatform.ready(function() {

			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {

				StatusBar.styleDefault();
			}

			$rootScope.$on("$ionicView.beforeEnter", function(event, data){

				// if(ConnectivityMonitor.isOffline()){
				// 	$ionicPopup.confirm({
				// 		title: "Internet Info",
				// 		content: "No internet connection detected on your device."
				// 	})
				// 	.then(function(result) {
				// 		if(!result) {
				// 			ionic.Platform.exitApp();
				// 		}
				// 	});
				// }
			});
		});
	})
	.constant('USER_ID', 'user_id')
	.constant('USER_OBJ', 'user_obj')
	.constant('FB_USER', 'fb_user')
	//.constant('API_URL', 'http://localhost:5000/api/v1/')
	.constant('API_URL', 'https://ionphotoshare.herokuapp.com/api/v1/')
	.constant('LiveSocketIOURL', 'https://ionphotoshare.herokuapp.com/')



	;

