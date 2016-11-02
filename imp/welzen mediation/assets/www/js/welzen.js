angular.module('welzen', ['ionic', 'ngCordova','ionic.service.core', 'ionic.service.analytics', 'ionic-timepicker', 'ionic-ratings'])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
$ionicConfigProvider.views.swipeBackEnabled(false);

  $stateProvider

    .state('player', {
      cache: false,
      url : '/player',
      params:{ media: null},
      templateUrl : 'views/player/player.html',
      controller : 'PlayerController'
    })

    .state('rating', {
      cache : false,
      url : '/rating',
      templateUrl : 'views/rating/rating.html',
      controller : 'RatingController'
    })

    .state('language', {
      cache: false,
      url: '/language',
      templateUrl : 'views/language/language.html'
    })

    .state('landing', {
      cache: false,
      url: '/landing',
      templateUrl : 'views/landing/landing.html'
    })

    .state('login', {
      cache: false,
      url: '/login',
      templateUrl : 'views/login/login.html',
      controller : 'LoginController',
      params :{buying:null,product:null}
    })

    .state('signup', {
      cache: false,
      url: '/signup',
      templateUrl : 'views/signup/signup.html',
      controller : 'LoginController',
      params :{buying:null,product:null}
    })

    .state('forgot', {
      cache: false,
      url: '/forgot',
      templateUrl : 'views/forgot/forgot.html',
      controller : 'LoginController'
    })

    .state('main', {
      url: '/main',
      templateUrl : 'views/main/main.html',
      controller : 'MenuController'
    })

    .state('5-days', {
      cache: false,
      url: '/5-days',
      templateUrl : 'views/5-days/5-days.html',
      controller : 'fiveDaysCtrl'
    })

    .state('single-meditation', {
      cache: false,
      url: '/guided-meditations/single-meditation',
      templateUrl : 'views/guided-meditations/guided-meditations-sm.html',
      params : {category:null},
      controller : 'guidedMeditationsSMCtrl'
    })

    .state('unlock', {
      cache: false,
      url: '/unlock',
      templateUrl : 'views/unlock/unlock.html',
      controller : 'unlockCtrl'
    })

    .state('billing-details', {
      cache: false,
      url: '/unlock/billing-details',
      templateUrl : 'views/unlock/billing-details.html',
      controller : 'LoginController'
    })

    .state('program-series', {
      cache: false,
      url: '/guided-meditations/program-series',
      templateUrl : 'views/guided-meditations/program-series.html',
      params : {category:null},
      controller : 'programSeriesCtrl'
    })

    .state('single-meditation-detail', {
      cache: false,
      url: '/guided-meditations/single-meditation/detail',
      templateUrl : 'views/guided-meditations/guided-meditations-sm-detail.html',
      params : {meditation:null},
      controller : 'guidedMeditationsSMDetailCtrl'
    })

    .state('mindfulness-coaching', {
      cache: false,
      url: '/mindfulness-coaching',
      templateUrl : 'views/mindfulness-coaching/mindfulness-coaching.html',
      params : {category:null},
      controller : 'mindfulnessCoachingCtrl'
    })

    .state('science', {
      cache: false,
      url: '/science',
      templateUrl : 'views/science/science.html',
      controller: 'LoginController'
    })

    .state('about', {
      cache: false,
      url: '/about',
      templateUrl : 'views/about/about.html',
      controller: 'LoginController'
    })

    .state('success', {
      cache: false,
      url: '/unlock/success',
      templateUrl : 'views/subscriptions/success.html'
    })

    .state('upgrade', {
      cache: false,
      url: '/unlock/upgrade',
      templateUrl : 'views/subscriptions/upgrade.html'
    })

    .state('cancel', {
      cache: false,
      url: '/unlock/cancel',
      templateUrl : 'views/subscriptions/cancel.html',
      controller : 'cancelSubsCtrl'
    })

    .state('corporate-success', {
      cache: false,
      url: '/unlock/corporate-success',
      templateUrl : 'views/subscriptions/corporate.html'
    })

    .state('already', {
      cache: false,
      url: '/unlock/already',
      templateUrl : 'views/subscriptions/already.html',
      controller : 'alreadySubsCtrl'
    })

    .state('stats', {
      cache: false,
      url: '/stats',
      templateUrl : 'views/stats/stats.html'
    })

    .state('corporate', {
      cache: false,
      url: '/corporate',
      templateUrl: 'views/corporate/connect.html',
      controller: 'LoginController'
    })

    .state('corporate-discounts', {
      cache: false,
      url: '/corporate/discounts',
      templateUrl: 'views/corporate/discounts.html',
      controller: 'LoginController'
    })

    .state('corporate-connect-1', {
      cache: false,
      url: '/corporate/step1',
      templateUrl: 'views/corporate/step1.html',
      controller: 'LoginController'
    })

    .state('corporate-request', {
      cache: false,
      url: '/corporate/request',
      templateUrl: 'views/corporate/request.html',
      controller: 'LoginController'
    })

    .state('corporate-connect-2', {
      cache: false,
      url: '/corporate/step2',
      templateUrl: 'views/corporate/step2.html',
      controller: 'LoginController'
    })

    .state('corporate-already', {
      cache: false,
      url: '/corporate/already',
      templateUrl : 'views/corporate/already.html'
    })

    .state('live-meditations', {
      cache: false,
      url: '/live',
      templateUrl: 'views/live-meditations/live-meditations.html',
      controller: 'programSeriesCtrl'
    })

    .state('no-live-meditations', {
      cache: false,
      url: '/live/none',
      templateUrl: 'views/live-meditations/none.html',
      controller: 'LoginController'
    })

    .state('rsvp', {
      cache: false,
      url: '/live/rsvp',
      templateUrl: 'views/live-meditations/rsvp.html',
      controller: 'LoginController'
    })

    .state('settings', {
      cache: false,
      url: '/settings',
      templateUrl: 'views/settings/settings.html',
      controller: 'settingsCtrl'
    })

    .state('downloads', {
      cache: false,
      url: '/downloads',
      templateUrl: 'views/downloads/downloads.html',
      controller: 'DownloadsController'
    })

    .state('reminders', {
      cache: false,
      url: '/reminders',
      templateUrl: 'views/reminders/reminders.html',
      controller: 'RemindersController'
    })

    .state('language-settings', {
      cache: false,
      url: '/language-settings',
      templateUrl: 'views/language/language-settings.html',
      controller: 'LanguageController'
    })

    .state('terms', {
      cache: false,
      url: '/terms',
      templateUrl: 'views/terms/terms.html',
      controller: 'LoginController'
    });

  $urlRouterProvider.otherwise('/landing');

  $httpProvider.interceptors.push(function(WelzenAPI) {
    return {
      request: function(config) {
        if(config.url.startsWith(WelzenAPI.SERVER_URL)){
          config.headers.Authorization = 'Basic d2VsemVuOldlbHplbi4xOTg2';
        }
        return config;
      },
      requestError: function(response) {
        console.log('requestError ' );
        return response;
      },
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        console.log('responseError ');
        return response;
      }
    };
  });
})

.run(function($ionicPlatform, MeditationOfflineService, VersionFileService, $state, InAppPurchaseService, userService, stateService, $ionicAnalytics) {
  $ionicPlatform.ready(function() {

    //Apago las analyics de desa
    $ionicAnalytics.register();

    //le deshabilito el back button en Android
    $ionicPlatform.registerBackButtonAction(function (event) {
      event.preventDefault();
    }, 100);

    userService.init();

    stateService.init();

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.hide();
    }

    MeditationOfflineService.init().then(function(success){
       console.log('MeditationOfflineService loaded. '  + success.length);
    });

    VersionFileService.updateFile();

    InAppPurchaseService.initialize(function(products){
        console.log("Welzen. InAppPurchaseService is READY!. Products loadead: " + products.length);
    });


    if (window.AppRate){
        AppRate.preferences.storeAppURL.ios = '1065762791';
        AppRate.preferences.storeAppURL.android = 'market://details?id=com.welzen.welzen';  
    }else{
        console.log("AppRate not defined, running in a browser?");
    }

    
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.backgroundMode) {

        cordova.plugins.backgroundMode.configure({
          silent: false,
            title:  "Welzen",
            ticker: "Welzen is working on the background.",
            text:   "Welzen is working on the background."      
        })

        cordova.plugins.backgroundMode.setDefaults({
          silent: false,
            title:  "Welzen",
            ticker: "Welzen is working on the background.",
            text:   "Welzen is working on the background."
        })
    }
    ///Google analytics
    if(window.analytics !== undefined) {
       console.log("Google Analytics Available");
       window.analytics.startTrackerWithId("UA-79513739-2");
    } else {
       console.log("Google Analytics Unavailable");
    }


   if (window.plugins && window.plugins.OneSignal) {
      var notificationOpenedCallback = function(jsonData) {
          console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      };
      window.plugins.OneSignal.init("ca7e48cf-c4f1-4716-815d-713d344dad4e",
                                 {googleProjectNumber: "899558115462"},
                                 notificationOpenedCallback);
      window.plugins.OneSignal.enableInAppAlertNotification(true);

   }else{
        console.log("Push notification not enable, running in a browser?");
   }
 
  });
});
