controllerModule.controller('SettingsCtrl', function($scope, $state, $ionicLoading, $window, $cordovaDialogs, authenticationFactory, visitorFactory, networkFactory) {

  visitorFactory.handleAction("settings");

  // Check if authenticated...
  if (authenticationFactory.authenticatedWithTwitter()) {
    $scope.connectedTwitter = true;
    $scope.twitterConnectStatus = "Connected";
  } else {
    $scope.connectedTwitter = false;
    $scope.twitterConnectStatus = "Connect with Twitter";
  }

  if (authenticationFactory.authenticatedWithInstagram()) {
    $scope.connectedInstagram = true;
    $scope.instagramConnectStatus = "Connected";
  } else {
    $scope.connectedInstagram = false;
    $scope.instagramConnectStatus = "Connect with Instagram";
  }

  $scope.handleTwitterAuth = function() {
    if (networkFactory.isNetworkOffline()) {
      $cordovaDialogs.alert("Oops, can't connect to Twitter right now because there is no internet connection...", function(){}, 'Sorry');
      return; 
    }

    if (!authenticationFactory.authenticatedWithTwitter()) {
      visitorFactory.handleAction("settings_twtr");

      authenticationFactory.handleTwitterAuth().then(function() {
        $ionicLoading.hide();
        $scope.connectedTwitter = true;
        $scope.twitterConnectStatus = "Connected";
      });

    } else {
      console.log('already connected with twitter');
    }
  }

  $scope.handleInstagramAuth = function() {
    if (networkFactory.isNetworkOffline()) {
      $cordovaDialogs.alert("Oops, can't connect to Instagram right now because there is no internet connection...", function(){}, 'Sorry');
      return; 
    }

    if (!authenticationFactory.authenticatedWithInstagram()) {

      visitorFactory.handleAction("settings_ig");

      $ionicLoading.show({
        template: 'Contacting Throwback...'
      });

      authenticationFactory.handleInstagramAuth().then(function() {
        $ionicLoading.hide();
        $scope.connectedInstagram = true;
        $scope.instagramConnectStatus = "Connected";
      });
    
    } else {
      console.log('already connected with Instagram');
    }

  }

  $scope.handleRateApp = function() {
    if (networkFactory.isNetworkOffline()) {
      $cordovaDialogs.alert("Can't find an internet connection...", function(){}, 'Sorry');
      return; 
    }
    
    if (ionic.Platform.isIOS()) {
      visitorFactory.handleAction("ios_rate");
      $window.open("itms-apps://itunes.apple.com/us/app/throwback-your-daily-dose/id903169371?mt=8");
    } else if (ionic.Platform.isAndroid()) {
      visitorFactory.handleAction("android_rate");
      $window.open("market://details?id=com.throwback.throwbackapp", "_system");
    } else {
      visitorFactory.handleAction("other_rate");
      $window.open("http://www.throwbacknow.com/#!/", "_blank");
    }
  }

  $scope.handleLogOut = function () {
    authenticationFactory.handleLogOut();
    visitorFactory.handleAction("logout");
  }

  $scope.goBack = function () {
    visitorFactory.handleAction("settings_back");
    $state.go('feed');
  }

});
