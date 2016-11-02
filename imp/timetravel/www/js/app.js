
// Wrap each plugin call with the deviceready event - important !
// document.addEventListener("deviceready", function () {
//  $cordovaPlugin.someFunction().then(success, error);
// }, false);

var SPEED_OF_LIGHT_MS = 299792458;
var MPH_IN_KMH = 0.6213711922;


angular.module('starter', [
  'ionic', 
  'ionic.utils', 
  'ngCordova', 
  'starter.controllers-dash', 
  'starter.controllers-other', 
  'starter.services-timer',
  'starter.services-utils',
  'starter.services-share',
  'starter.services-history',
  'starter.services-variables'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    // hide the splash screen only after everything's ready (avoid flicker)
    // requires keyboard plugin and confix.xml entry telling the splash screen to stay until explicitly told
    if(navigator.splashscreen){
      navigator.splashscreen.hide();
    }
  });
})

// https://blog.nraboy.com/2014/09/handling-apache-cordova-events-ionicframework/
//
// record a timeout (such that timewatch resumes when needed)
.run(function($ionicPlatform, $state, $rootScope) {
    $ionicPlatform.ready(function() {
      document.addEventListener("pause", function() {
        if($state.current.name == "tab.dash") {
            $rootScope.$broadcast('timeOutEvent:leaveDash', {});
        } else {
            $rootScope.$broadcast('timeOutEvent:leaveOther', {});
        }
      }, false);
      document.addEventListener("resume", function() {
        if($state.current.name == "tab.dash") {
            $rootScope.$broadcast('timeOutEvent:resumeDash', {});
        } else {
            // do nothing
        }
        
      }, false);
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


  // http://ionicframework.com/docs/api/provider/$ionicConfigProvider/
  // $ionicConfigProvider.views.transition('ios')
  $ionicConfigProvider.tabs.style('standard')
  $ionicConfigProvider.tabs.position('bottom')
  


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  
  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'AccountCtrl'
      }
    }
  })
    .state('tab.tutorial', {
      url: '/settings/tutorial',
      views: {
        'tab-settings': {
          templateUrl: 'templates/settings-tutorial.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('tab.stars', {
      url: '/settings/stars',
      views: {
        'tab-settings': {
          templateUrl: 'templates/blanc.html',
          controller: 'AccountCtrl'
        }
      }
    })

  .state('tab.history', {
    url: '/history',
    views: {
      'tab-history': {
        templateUrl: 'templates/tab-history.html',
        controller: 'HistoryCtrl'
      }
    }
  })
  
  
  .state('design', {
    url: '/design',
    templateUrl: 'templates/design.html',
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
