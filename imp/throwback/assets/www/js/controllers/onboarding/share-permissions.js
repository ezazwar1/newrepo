controllerModule.controller('SharePermissionsCtrl', function($scope, $state, $cordovaDialogs, $ionicLoading, $ionicViewService, visitorFactory, authenticationFactory, networkFactory) {
  
  $ionicViewService.clearHistory();

  visitorFactory.handleAction("share_permissions");
  $scope.isGotItDisabled = false;

  $scope.handleAskForSharePermissions = function() {

    $scope.isGotItDisabled = true;

    if (networkFactory.isNetworkOffline()) {
      $cordovaDialogs.alert("An internet connection wasn't found!", function(){}, 'Sorry');
      return; 
    }

    $ionicLoading.show({
      template: 'Loading... &nbsp;<i class="icon ion-loading-c"></i>'
    });


    visitorFactory.handleAction("share_permissions_got_it").then(function(result) {

      authenticationFactory.handleAddFacebookPermissions('publish_actions').then(function(result) {
        visitorFactory.handleAction("share_permissions_found_publish_actions").then(function(result) {
          $ionicLoading.hide();
           $state.go('future');
        });       
      },
      function(error) {

         var params = {
            'message': JSON.stringify(error),
            'file': "controllers/share-permissions.js:handleAskForSharePermissions"
          }
          Parse.Cloud.run('sendErrorEmail', params, {
            success: function(result) {
              console.log('successfully sent error email');
            },
            error: function (error) {
              console.log(error);

              var params = {
                'message': "error while sendErrorEmail ran in share permissions onboarding - " + error,
                'file': "controllers/share-permissions.js:handleAskForSharePermissions"
              }
              Parse.Cloud.run('sendErrorEmail', params, {
                success: function(result) {
                  console.log('successfully sent email');
                },
                error: function (error) {
                  console.log(error);
                }
              });

            }
          });


        if (error == 'permissions_error') {
          visitorFactory.handleAction("share_permission_user_decline_publish_actions").then(function(result) {
            $ionicLoading.hide();
            $state.go('future');
          });
        } else {
          visitorFactory.handleAction("share_permissions_handle_add_facebook_permission_error").then(function(result) {
            $ionicLoading.hide();
            visitorFactory.handleAction("share_permissions_handle_add_facebook_permission_error_" + error);
            $state.go('future');
          });
        }
      });
    });
  }
});
