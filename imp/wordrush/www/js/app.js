// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'angular-svg-round-progress', 'LocalStorageModule', 'wordrush.factory'])

.constant("APP_CONSTANT", {
    "USERNAME_LS_KEY" : "username_ls_key",
    "BEST_CHECK_LS_KEY": "best_check_ls_key",
    "BEST_LS_KEY": "best_ls_key",
    "MUSIC_LS_KEY": "music_ls_key",
    "FB_CHILD_LS_KEY" : "fb_child_ls_key",
    "FIRSTRUN_LS_KEY" : "firstrun_ls_key",
    "TOTAL_RANK_TO_SHOW" : 250
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Admob

    //select the right Ad Id according to platform 
    // var admobid = {};
     
    //   admobid = {            
    //         interstitial: 'ca-app-pub-1204262321700562/9653073534'
    //     };

    // if (AdMob) AdMob.createBanner({
    //     adId: admobid.banner,
    //     position: AdMob.AD_POSITION.BOTTOM_CENTER,
    //     isTesting: false, // TODO: remove this line when release
    //     overlap: false,
    //     offsetTopBar: false,
    //     bgColor: 'black',
    //     autoShow: true
    // });

    //preppare and load ad resource in background, e.g. at begining of game level 
    //if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, isTesting: false, autoShow:false} );

    // Admob ends       
  });
})

.config(function($stateProvider, $urlRouterProvider, $cordovaAppRateProvider) {

  document.addEventListener("deviceready", function () {

   var prefs = {
     language: 'en',
     appName: 'Word Rush',
     usesUntilPrompt: 2,
     iosURL: '<my_app_id>',
     androidURL: 'market://details?id=com.word.rush'
   };

   $cordovaAppRateProvider.setPreferences(prefs);

 }, false);

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
    // controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    },
    cache: false
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'playAreaCtrl'
        }
      },
       cache: false
    });
  //   .state('app.playlists', {
  //     url: '/playlists',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/playlists.html',
  //         controller: 'PlaylistsCtrl'
  //       }
  //     }
  //   })

  // .state('app.single', {
  //   url: '/playlists/:playlistId',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/playlist.html',
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
