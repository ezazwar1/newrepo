angular.module('edit.controller', ['ngCordova'])
.controller('EditCtrl', function($scope,$ionicModal,$ionicSlideBoxDelegate,$state,$ionicPlatform,$cordovaGoogleAnalytics) {
$ionicPlatform.ready(function() {
    if (window.StatusBar) {
      $cordovaGoogleAnalytics.trackView('Edit Screen');
    }
  });



  

});
