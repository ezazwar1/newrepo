// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var app = angular.module(
  'throwbackMobile', [
  'ionic', 
  'ngCordova',
  'FacebookConnectPlugin',
  'ParsePlugin',
  'parse-angular', 
  'LocalStorageModule',
  'throwbackMobile.controllers',
  'services.config'
  ]);

app.run(function($rootScope, $ionicPlatform, facebook, configuration, userFactory, pushNotificationFactory) {
  $rootScope.sessionUser = Parse.User.current();

  var onResumeAndStartUp = function() {
    if ($rootScope.sessionUser) {
      userFactory.handleAnalytics();

      if (!$rootScope.sessionUser.get('enabledPush') && $rootScope.sessionUser.get('onMobile')) {
        pushNotificationFactory.setUpPushNotifications();
      }  
    }
  }

  $ionicPlatform.ready(function() {
    onResumeAndStartUp();

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Handle the resume event
    var onResumeHandler = function() {
      console.log('onResume');
      onResumeAndStartUp();

      // Check if eligible for last throwback created and fire event if so
      $rootScope.$broadcast('refreshFeed');
    }

    document.addEventListener('resume', onResumeHandler, false);

    if (ionic.Platform.isIOS()) {
      console.log('iOS');
    } else if (ionic.Platform.isAndroid()) {
      console.log('Android');

      // disable back button on Android
      // $ionicPlatform.registerBackButtonAction(function() {
      //   console.log('back button'); 
      // }, 100);

    } else {
      console.log('web or some other platform');
      facebook.browserInit(configuration.facebookAppID);
    }
    console.log(ionic.Platform.platform());
  });

  $rootScope.facebookApplicationID = configuration.facebookAppID;
  $rootScope.baseURL = configuration.baseURL;
  $rootScope.googleAnalyticsID = configuration.GoogleAnalyticsID;

  // Set Parse Keys TODO: MAKE THIS SAFER
  $rootScope.parseApplicationID = configuration.parseApplicationID;
  $rootScope.parseRESTAPIKey = configuration.parseRESTAPIKey;

  // Set Twitter Consumer Key and Secret TODO: MAKE THIS SAFER
  $rootScope.twitterConsumerKey = configuration.twitterConsumerKey;
  $rootScope.twitterSecret = configuration.twitterSecret;
});

app.config(function($stateProvider, $urlRouterProvider, configuration) {

  // Parse Initialization
  Parse.initialize(configuration.parseApplicationID, configuration.parseJavaScriptSDKKey);

  // OAuth.io Initialization
  OAuth.initialize(configuration.OauthIOKey);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('opening', {
      url: "/",
      views: {
        'content': {
          templateUrl: 'templates/opening.html',
          controller: 'OpeningCtrl'
        }
      }
    })

    .state('feed', {
      url: '/feed',
      resolve: {
        // feedCache: function(FeedService) {
        //   return FeedService.getState();
        // }
      },
      views: {
        'content': {
          templateUrl: 'templates/feed.html',
          controller: 'FeedCtrl'
        }
      }
    })

    .state('share', {
      url: '/share',
      views: {
        'content': {
          templateUrl: 'templates/share.html',
          controller: 'ShareCtrl'
        }
      }
    })

    .state('settings', {
      url: '/settings',
      views: {
        'content': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })

    .state('share-permissions', {
      url: '/share-permissions',
      views: {
        'content': {
          templateUrl: 'templates/share_permissions.html',
          controller: 'SharePermissionsCtrl'
        }
      }
    })

    .state('connect', {
      url: '/connect',
      views: {
        'content': {
          templateUrl: 'templates/connect.html',
          controller: 'ConnectCtrl'
        }
      }
    })

    .state('future', {
      url: '/future',
      views: {
        'content': {
          templateUrl: 'templates/future.html',
          controller: 'FutureCtrl'
        }
      }
    })

    .state('push', {
      url: '/push',
      views: {
        'content': {
          templateUrl: 'templates/push.html',
          controller: 'PushCtrl'
        }
      }
    })

    .state('canvas', {
      url: '/canvas',
      views: {
        'content': {
          templateUrl: 'templates/canvas.html',
          controller: 'CanvasCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  var currentUser = Parse.User.current();

  if (currentUser && currentUser.get('onMobile')) {
    $urlRouterProvider.otherwise('/feed');
  } else {
    $urlRouterProvider.otherwise('/');
  }
});


var controllerModule = angular.module('throwbackMobile.controllers', []);
