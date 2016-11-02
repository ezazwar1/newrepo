
app.factory('pushNotificationFactory', function($rootScope, $q, $ionicPlatform, parsePlugin) {
  var pushNotificationFactory = {};

  pushNotificationFactory.setUpPushNotifications = function () {
    var setUpPushNotificationsPromise = $q.defer();

    $ionicPlatform.ready(function() {
      if (ionic.Platform.isIOS()) {
        console.log('Initializing push notifications for iOS');
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(
          function(result) {
            console.log(result);

            $rootScope.sessionUser.fetch().then(function(user) {
              if (result == 'disabled') {
                $rootScope.sessionUser = user;
                user.set('enabledPush', false);
              } else {
                $rootScope.sessionUser = user;
                user.set('enabledPush', true);
              }
              user.save();
            });
          },
          function(result) {
            console.log(result);
            $rootScope.sessionUser.fetch().then(function(user) {
              user.set('enabledPush', false);
              user.save();
            });
          },
          {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"onNotificationAPN",
            "currentUserID":Parse.User.current().id
          });
      } else if (ionic.Platform.isAndroid()) {
        console.log('Initializing push notifications for Android');

        if (Parse.User.current()) {
          var error = function(message) { 
            console.log("Oopsie! " + message); 
          };

          $rootScope.sessionUser.fetch().then(function(user) {
            $rootScope.sessionUser = user;
            user.set('enabledPush', true);
            user.set('onMobile', true);
            user.save().then(function(response) {
              parsePlugin.setForUserInInstallation($rootScope.sessionUser.id, null, error);
            });
          });
        }

        setUpPushNotificationsPromise.resolve(true);
      } else {
        console.log('Push Notifications not supported on this platform');
        setUpPushNotificationsPromise.resolve(true);
      }
    });

    return setUpPushNotificationsPromise.promise;
  }

  return pushNotificationFactory;
});