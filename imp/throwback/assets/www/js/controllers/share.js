controllerModule.controller('ShareCtrl', function($rootScope, $scope, $state, $ionicLoading, $window, $cordovaDialogs, shareFactory, authenticationFactory, visitorFactory, configuration, networkFactory) {

  if (!shareFactory.share_activity) {
    // Go back to feed if share_activity didn't load
    $state.go('feed');
  }

  window.addEventListener('native.keyboardshow', keyboardShowHandler);

  function keyboardShowHandler(e) {
      var windowHeight = $window.innerHeight - 60;
      var remainingHeight = windowHeight - e.keyboardHeight;

      $('.share-box').css('height', windowHeight);
      $('.share-message').css('height', windowHeight-35-54);
  }

  $scope.shareWithFacebook = false;
  $scope.shareWithTwitter = false;
  $scope.shareWithInstagram = false;

  $scope.shareMessage;

  $scope.placeholderMessage = 'Exactly ' + shareFactory.share_activity.getPrettyYearsAgo() + ' today! Found this via (' + configuration.baseURL + ')';

  $scope.handleFacebookToggle = function() {
    console.log('handleFacebookToggle');
    visitorFactory.handleAction("share_toggle_fb");
  }

  $scope.handleTwitterToggle = function() {
    visitorFactory.handleAction("share_toggle_twtr");
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
    // We don't need to integrate with Instagram to share
    console.log('handleInstagramToggle');
    visitorFactory.handleAction("share_toggle_ig");
  }

  $scope.handleShare = function() {
    visitorFactory.handleAction("share_post");

    var share_message;

    if ($scope.shareMessage) {
      share_message = $scope.shareMessage;
    } else {
      share_message = $scope.placeholderMessage;
    }

    $ionicLoading.show({
      content: 'Sharing... &nbsp;<i class="icon ion-loading-c"></i>',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    if (networkFactory.isNetworkOffline()) {
      $ionicLoading.hide();
      $cordovaDialogs.alert("An internet connection wasn't found!", function(){}, 'Sorry');
      return;
    } 

    shareFactory.handleShare(share_message, 
                             $scope.shareWithFacebook, 
                             $scope.shareWithTwitter, 
                             $scope.shareWithInstagram).
    then(function(response) {
      $ionicLoading.hide();
      $state.go('feed');
    });
  }

});
