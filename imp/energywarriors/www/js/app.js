// Energy Warrior App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])


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

  });


})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $sceDelegateProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);
  //use native scrolling for android here
  if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);
  //override tabs in bottom for android platforms
  $ionicConfigProvider.tabs.position(false);
  //overide striped tabs in android
  $ionicConfigProvider.tabs.style(false);
  //setnavbar title align for Android
  if(!ionic.Platform.isIOS())$ionicConfigProvider.navBar.alignTitle(false);

  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.connect', {
    url: '/connect',
    views: {
      'tab-connect': {
        templateUrl: 'templates/tab-connect.html',
        controller: 'ConnectCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.profiles', {
    url: '/profiles',
    views: {
      'tab-profiles': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('tab.profileDetail', {
    url: '/profile/detail',
    views: {
      'tab-profiles': {
        templateUrl: 'templates/tab-profile-detail.html',
        controller: 'ProfileDetailCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/chats');

});

// .directive('playVideo', [function() {
//
//     var config = {
//         restrict: "A",
//         link : function (scope, elem, attrs) {
//
//             console.log("sdasdasd");
//
//             scope.mainVideoDisplay = false;
//             scope.controlVideo = function (e) {
//                 e.preventDefault();
//                 e.stopPropagation();
//
//                 if (
//                     (e.type === "keydown" && !scope.mainVideoDisplay)
//                     ||
//                     (e.type === "keydown" && e.keyCode !== 27)
//                 ) {
//                     return;
//                 }
//
//                 var iframe = document.querySelector("iframe"),
//                     videoState = function () {
//                         return scope.mainVideoDisplay ? "playVideo" : "pauseVideo";
//                     };
//
//                 scope.mainVideoDisplay =  !scope.mainVideoDisplay;
//
//                 iframe.contentWindow.postMessage(JSON.stringify({
//                     'event': 'command',
//                     'func': videoState(),
//                     'args': []
//                 }), "*");
//
//                 scope.$apply();
//             };
//
//
//             elem.on("click", scope.controlVideo);
//             window.addEventListener("keydown", scope.controlVideo, false);
//
//         }
//     };
//
//     return config;
//
// }]);
