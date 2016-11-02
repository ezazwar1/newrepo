
angular.module('shiptApp', [
    'ionic',
    // 'ionic.service.core',
    // 'ionic.service.deploy',
    'ngCordova',
    'cgBusy',
    'common',
    'ionic.rating',
    'ionicLazyLoad',
    'ui.utils.masks',
    'ngIOS9UIWebViewPatch',
    'uiGmapgoogle-maps',
    'ngAria',
    'app.shipt.search',
    'shiptApp.config',
    'shiptApp.constants'])

.run(['$ionicPlatform','$ionicScrollDelegate','$timeout','AppAnalytics','$rootScope',function($ionicPlatform,$ionicScrollDelegate,$timeout,AppAnalytics,$rootScope) {
  $ionicPlatform.ready(function() {
      AppAnalytics.initSegment();
      if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
          cordova.plugins.Keyboard.disableScroll(true);
          $timeout(function(){
              navigator.splashscreen.hide();
          },500)
      }
      if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
      }
      if (window.cordova && ionic.Platform.isIOS()) {
          window.addEventListener("statusTap", function() {
              $ionicScrollDelegate.scrollTop(true);
          });
      }
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      AppAnalytics.page(event, toState, toParams, fromState, fromParams);
  })
}]);
