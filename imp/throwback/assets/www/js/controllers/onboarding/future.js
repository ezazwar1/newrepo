controllerModule.controller('FutureCtrl', function($scope, $state, $ionicLoading, $ionicViewService, $cordovaDialogs, authenticationFactory, onboardingShareFactory, visitorFactory, networkFactory) {

  $ionicViewService.clearHistory();

  var defaultShareMessage = 'Hey future. This is me from 1 year ago. I just signed up for http://throwbacknow.com. Cya!';

  $scope.shareMessage = '';

  $scope.shareWithFacebook = true;
  $scope.shareWithTwitter = false;
  $scope.shareWithInstagram = false;

  visitorFactory.handleAction("future");

  $scope.isShareDisabled = false;

  $scope.handleFacebookToggle = function() {

  }

  $scope.handleTwitterToggle = function() {
    if (!authenticationFactory.authenticatedWithTwitter()) {
      console.log('not authenticated with twitter!');
      $ionicLoading.show({
        template: 'Contacting Throwback...'
      });
      authenticationFactory.handleTwitterAuth().then(function() {
        $ionicLoading.hide();
      });
    }
  }

  $scope.handleInstagramToggle = function() {
    if (!authenticationFactory.authenticatedWithInstagram()) {
      console.log('not authenticated with instagram!');
      $ionicLoading.show({
        template: 'Contacting Throwback...'
      });
      authenticationFactory.handleInstagramAuth().then(function() {
        $ionicLoading.hide();
      });
    }
  }

  $scope.handleShare = function() {
    $ionicLoading.show({
      template: 'Sharing... &nbsp;<i class="icon ion-loading-c"></i>'
    });

    $scope.isShareDisabled = true;

    if (networkFactory.isNetworkOffline()) {
      $ionicLoading.hide();
      $cordovaDialogs.alert("Oops, you couldn't post to yourself in the future because there is no internet connection...", function(){}, 'Sorry');
      return; 
    }

    if ($scope.shareMessage.length == 0) {
      $scope.shareMessage = defaultShareMessage;
    }

    visitorFactory.handleAction("future_didShare");

    onboardingShareFactory.handleShare($scope.shareMessage,
                                       $scope.shareWithFacebook,
                                       $scope.shareWithTwitter,
                                       $scope.shareWithInstagram).then(function() {
      $ionicLoading.hide();
      $state.go('push');
    });
  }

  $scope.handleSkip = function() {
    visitorFactory.handleAction("future_skip");
    $state.go('push');
  }

});
