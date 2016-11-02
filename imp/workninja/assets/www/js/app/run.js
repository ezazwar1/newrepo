// Startup initialization

app.run(function($ionicPlatform, $rootScope, $window, CONFIG) {
  $ionicPlatform.ready(function() {
    // Cordova and Ionic config
    if ($window.cordova) {
      // // iOS status bar
      // if ($window.StatusBar) {
      //   StatusBar.styleDefault();
      // }

      if(navigator && navigator.splashscreen) navigator.splashscreen.hide();

      // Keyboard plugin
      // if ($window.cordova.plugins && $window.cordova.plugins.Keyboard) {
      //   $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //   $window.cordova.plugins.Keyboard.disableScroll(true);
      // }

      // Get device info and app version
      $rootScope.appInfo = {
        deviceModel: $window.device.model,
        devicePlatform: $window.device.platform,
        deviceVersion: $window.device.version
      };
      $window.cordova.getAppVersion(function(version) {
        $rootScope.appInfo.appVersion = version;
      });

      // // WorkNinjaExt plugin
      // $window.cordova.plugins.WorkNinjaExt.configure({
      //   desiredAccuracy: CONFIG.desiredAccuracy,
      //   distanceFilter: CONFIG.distanceFilter,
      //   stationaryRadius: CONFIG.stationaryRadius,
      //   activityType: CONFIG.activityType,
      //   debug: CONFIG.locationDebug,
      //   publishKey: CONFIG.publish_key,
      //   subscribeKey: CONFIG.subscribe_key,
      //   secretKey: CONFIG.secret_key
      // });

      // broadcast cordova events
      document.addEventListener('deviceready', function() {
        console.log('[Cordova] deviceready');

        document.addEventListener('pause', function() {
          console.log('[Cordova] pause');
          $rootScope.$broadcast('event:app-pause');
        }, false);
        document.addEventListener('resume', function() {
          console.log('[Cordova] resume');
          $rootScope.$broadcast('event:app-resume');
        }, false);
        document.addEventListener('offline', function() {
          console.log('[Cordova] offline');
          $rootScope.$broadcast('event:app-offline');
        }, false);
        document.addEventListener('online', function() {
          console.log('[Cordova] online');
          $rootScope.$broadcast('event:app-online');
        }, false);

        //document.addEventListener('backbutton', function(event) {
        //  console.log('[Cordova] backbutton');
        //  event.preventDefault();
        //}, false);

        $rootScope.$broadcast('event:app-ready');
      }, false);
    }
    else {
      $rootScope.appInfo = {
        deviceModel: 'dev',
        devicePlatform: 'dev',
        deviceVersion: 'dev',
        appVersion: 'dev'
      };
    }
  });

  $rootScope.clearHistory = function() {
    $rootScope.$viewHistory.histories.root.stack = [];
    $rootScope.$viewHistory.views = {};
  };
});
