controllerModule.controller('OpeningCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicPopup, $cordovaDialogs, authenticationFactory, visitorFactory, networkFactory) {

  visitorFactory.handleAction("opening");
  $scope.isConnectDisabled = false;

  $scope.handleFBAuth = function() {

    $scope.isConnectDisabled = true;

    $ionicLoading.show({
      template: 'Booting up... &nbsp;<i class="icon ion-loading-c"></i>'
    });

    visitorFactory.handleAction("user_connect").then(function(action) {
      console.log(action);

      if (networkFactory.isNetworkOffline()) {
        $ionicLoading.hide();
        $cordovaDialogs.alert("Oops, can't connect to Throwback because there is no internet connection...", function(){}, 'Sorry');
        return; 
      }

      authenticationFactory.handleFacebookAuth().then(
        function(status) {
          if (status == 200 && authenticationFactory.completedOnboarding()) {
            visitorFactory.handleAction("user_signin").then(function(action) {
              $ionicLoading.hide();
              $state.go('feed');
            });
          } else {
            visitorFactory.handleAction("user_signup").then(function(action) {
              $ionicLoading.hide();
              $state.go('share-permissions');    
            });
          }
        }, function(error) {
          $ionicLoading.hide();

          $scope.isConnectDisabled = false;

          var params = {
            'message': JSON.stringify(error),
            'file': "controllers/opening.js:handleFBAuth"
          }
          Parse.Cloud.run('sendErrorEmail', params, {
            success: function(result) {
              console.log('successfully sent error email');
            },
            error: function (error) {
              console.log(error);

              var params = {
                'message': "error in opening FB connect - " + error,
                'file': "controllers/feed.js:handleShare"
              }
              Parse.Cloud.run('sendErrorEmail', params, {
                success: function(result) {
                  console.log('successfully connected');
                },
                error: function (error) {
                  console.log(error);
                }
              });

            }
          });


          if (error === "permissions_error") {
            var fbRejectPopup = $ionicPopup.alert({
              title: 'Oops!',
              template: '<center>We need your Facebook permissions to connect!</center>'
            });

            visitorFactory.handleAction("user_decline_fb");
          } else {
            var fbRejectPopup = $ionicPopup.alert({
              title: 'Uh oh...',
              template: '<center>Something unexpected occurred. Please try to connect again.</center>'
            });
            visitorFactory.handleAction("user_connect_error");
          }
        });
    });
  }

});
