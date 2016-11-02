// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// 
// 




var app = angular.module('starter', ['ionic', 'ngCordova', 'ui.router','starter.controllers', 'home.controller',
                                    'song.controller', 'book.controller', 'invite.controller','guest.controller',
                                    'album.controller', 'edit.controller']);

angular.module('starter').directive('imgPreload', ['$rootScope', function($rootScope) {
    return {
      restrict: 'A',
      scope: {
        ngSrc: '@'
      },
      link: function(scope, element, attrs) {
        element.on('load', function() {
          element.removeClass('loadingImg');
        }).on('error', function() {
          //
        });

        scope.$watch('ngSrc', function(newVal) {
          element.addClass('loadingImg');
        });
      }
    };
}]);


app.run(function($ionicPlatform,$cordovaStatusbar,$cordovaSplashscreen,$cordovaGoogleAnalytics,$location,$state,$cordovaDialogs,$cordovaLocalNotification,$ionicSideMenuDelegate) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // 
    
    if (window.cordova && window.cordova.plugins.Keyboard) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      console.log('cordova plugins called');
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    
    if (window.StatusBar) {
      console.log('statusbar');
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
      $cordovaStatusbar.overlaysWebView(true);
      // styles: Default : 0, LightContent: 1, BlackTranslucent: 2, BlackOpaque: 3
      $cordovaStatusbar.style(1);

      //Set up adbuddiz
      // adbuddiz.setAndroidPublisherKey("6c63749e-6ec1-4dac-a9ce-6411f8bf8a0b");
      // adbuddiz.setIOSPublisherKey("fb25baa8-2813-4b8c-99bd-094b9f63f156");
      // adbuddiz.cacheAds();

      //Hide the splash screen
      //navigator.splashscreen.hide();
      


      // Init Google Analytics
      //UA-44724372-4
      //
      function _waitForAnalytics(){
            if(typeof analytics !== 'undefined'){
                $cordovaGoogleAnalytics.debugMode();
                $cordovaGoogleAnalytics.startTrackerWithId('UA-44724372-4');
                if (window.localStorage['user_id']) {
                    $cordovaGoogleAnalytics.setUserId(window.localStorage['user_id']);
                }
                //$cordovaGoogleAnalytics.setUserId(5);
                //$cordovaGoogleAnalytics.trackView('APP first screen');
            }
            else{
                setTimeout(function(){
                    _waitForAnalytics();
                },250);
            }
        };
        _waitForAnalytics();

      // $cordovaGoogleAnalytics.startTrackerWithId('UA-44724372-4');
      // $cordovaGoogleAnalytics.setUserId(5);
      // $cordovaGoogleAnalytics.trackView('Greetings Screen');


    }

    if (navigator.notification) { // Override default HTML alert with native dialog
          window.alert = function (message) {
              navigator.notification.alert(
                  message,    // message
                  null,       // callback
                  "Wedivite", // title
                  'Got it!'        // buttonName
              );
          };
    }
    // if (navigator.notification) { // Override default HTML alert with native dialog
    //       window.confirm = function (message) {
    //           navigator.notification.confirm(
    //               message,    // message
    //               null, //callback
    //               'Wedivite',
    //               ['Yes','No!']
    //           );
    //       };
    // }
  // $scope.alert = function(msg) {
  //   $cordovaDialogs.alert(msg, 'Wedivite', 'Got it!')
  //   .then(function() {
  //     // callback success
  //   });
  // }





    //Check if user is already logged-in and redirect to the corrosponding view
    
    if (window.localStorage['user_id']) {
      console.log('User is logged in');
      //$location.path('/app/home');
      //$state.transitionTo("app.home");
      $state.go('app.home');


      if (window.StatusBar) {
        setTimeout(function() {
          $cordovaSplashscreen.hide();

          setTimeout(function() {
            // adbuddiz.showAd();
          }, 1000);
          
        }, 2000);
      }
      
    } else {
      console.log('User is NOT logged in');
      $location.path('/onboarding');
      if (window.StatusBar) {
        setTimeout(function() {
          $cordovaSplashscreen.hide();
          $cordovaGoogleAnalytics.trackView('Login Screen');
        }, 1000);
      }
      //$location.path('/');
    }

    //Catch android menu button
    document.addEventListener("menubutton", onMenuKeyDown, false);

   function onMenuKeyDown() {
      //alert("some menu pops pup!! ");
      $ionicSideMenuDelegate.toggleLeft();
      // here change the view , etc... 
      //$rootScope.$apply();
    }



  }); //ionicready close
});





app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

.state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

.state('app.guestList', {
    url: "/guest-list",
    views: {
      'menuContent': {
        templateUrl: "templates/guest-list.html",
        controller: 'GuestCtrl'
      }
    }
  })
.state('app.songList', {
    url: "/song-list",
    views: {
      'menuContent': {
        templateUrl: "templates/song-list.html",
        controller: 'SongListCtrl'
      }
    }
  })
 .state('app.song', {
    url: "/song/:songId/:songName/:songArtist",
    views: {
      'menuContent': {
        templateUrl: "templates/song.html",
        controller: 'SongCtrl'
      }
    }
  })
.state('app.guestBook', {
    url: "/guest-book",
    views: {
      'menuContent': {
        templateUrl: "templates/guest-book.html",
        controller: 'BookCtrl'
      }
    }
  })
.state('app.weddingAlbum', {
    url: "/wedding-album",
    views: {
      'menuContent': {
        templateUrl: "templates/wedding-album.html",
        controller: 'WeddingAlbumCtrl'
      }
    }
  })
.state('app.invite', {
    url: "/invite-guests",
    views: {
      'menuContent': {
        templateUrl: "templates/invite-guests.html",
        controller: 'InviteCtrl'
      }
    }
  })
.state('app.edit', {
    url: "/edit-invitation",
    views: {
      'menuContent': {
        templateUrl: "templates/edit-invitation.html",
        controller: 'EditCtrl'
      }
    }
  })
  .state('onboarding', {
    url: "/onboarding",
    templateUrl: "templates/onboarding.html",
    controller: 'AppCtrl'
  })
 .state('app.photo', {
    url: "/photo/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/photo.html",
        controller: 'PhotoCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/onboarding');
});


