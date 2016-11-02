// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'LocalStorageModule'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.video.feature', {
        url: "/feature",
        views: {
          'home-tab': {
            templateUrl: "templates/tabs/feature.html",
            controller: "FeatureCtrl"
          }
        }
      })
      .state('app.video.subscribe', {
        url: "/subscribe",
        views: {
          'subscribe-tab': {
            templateUrl: "templates/tabs/subscribe.html",
            controller: "SubscribeCtrl"
          }
        }
      })
      .state('app.video.search', {
        url: "/search",
        views: {
          'search-tab': {
            templateUrl: "templates/tabs/search.html",
            controller: "SearchCtrl"
          }
        }
      })
      .state('app.video', {
        url: "/video",
        views: {
          'menuContent': {
            templateUrl: "templates/video.html"
          }
        }
      })
      .state('app.item', {
        url: "/item/:id",
        views: {
          'menuContent': {
            templateUrl: "templates/video_detail.html",
            controller: "VideoCtrl"
          }
        }
      })
      .state('app.history', {
        url: "/history",
        views: {
          'menuContent': {
            templateUrl: "templates/history.html",
            controller: "HistoryCtrl"
          }
        }
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/video/feature');
    $ionicConfigProvider.views.maxCache(0);

  })


