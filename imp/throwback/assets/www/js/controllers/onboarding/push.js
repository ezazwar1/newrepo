controllerModule.controller('PushCtrl', function($scope, $state, $cordovaDialogs, $ionicViewService, visitorFactory, pushNotificationFactory, authenticationFactory, networkFactory) {
  
  $ionicViewService.clearHistory();

  visitorFactory.handleAction("push");

  $scope.isAndroid = ionic.Platform.isAndroid();
  $scope.isSoundsGoodDisabled = false;

  $scope.handleAskForPushPermissions = function() {

    $scope.isSoundsGoodDisabled = true;

    if (networkFactory.isNetworkOffline()) {
      $cordovaDialogs.alert("An internet connection wasn't found!", function(){}, 'Sorry');
      return; 
    }

    pushNotificationFactory.setUpPushNotifications();
    authenticationFactory.setOnMobile();
    visitorFactory.handleAction("push_sounds_good");
    
    $state.go('feed');
  }
});
