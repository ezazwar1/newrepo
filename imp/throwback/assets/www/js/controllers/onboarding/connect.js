controllerModule.controller('ConnectCtrl', function($scope, $state, $ionicLoading, $cordovaDialogs, authenticationFactory, visitorFactory, twitterFactory) {

  if (!authenticationFactory.authenticatedWithTwitter()) {
    $scope.connectedTwitter = false;
    $scope.twitterConnectStatus = "Connect with Twitter";
  } else {
    $scope.connectedTwitter = true;
    $scope.twitterConnectStatus = "Done";
  }

  if (!authenticationFactory.authenticatedWithInstagram()) {
    $scope.connectedInstagram = false;
    $scope.instagramConnectStatus = "Connect with Instagram";
  } else {
    $scope.connectedInstagram = true;
    $scope.instagramConnectStatus = "Done";
  }

  visitorFactory.handleAction("connect");
  
  $scope.handleTwitterAuth = function() {
    if (!navigator.onLine) {
      $cordovaDialogs.alert("An internet connection wasn't found!", function(){}, 'Sorry');
      return;
    } 

    if (!authenticationFactory.authenticatedWithTwitter()) {
      visitorFactory.handleAction("connect_twtr");

      authenticationFactory.handleTwitterAuth().then(function() {
        $ionicLoading.hide();
        $scope.connectedTwitter = true;
        $scope.twitterConnectStatus = "Done";


        $cordovaDialogs.confirm('Follow Throwback on Twitter?', followThrowbackOnTwitter, 'Follow Us!', ['Not Now', 'Ok!']);
      });
    }
  }

  $scope.handleInstagramAuth = function() {
    if (!navigator.onLine) {
      $cordovaDialogs.alert("An internet connection wasn't found!", function(){}, 'Sorry');
      return; 
    }

    if (!authenticationFactory.authenticatedWithInstagram()) {
      $ionicLoading.show({
        template: 'Contacting Throwback... &nbsp;<i class="icon ion-loading-c"></i>'
      });

      visitorFactory.handleAction("connect_ig");

      authenticationFactory.handleInstagramAuth().then(function() {
        $ionicLoading.hide();
        $scope.connectedInstagram = true;
        $scope.instagramConnectStatus = "Done";
      });
    }
  }

  $scope.handleNext = function() {
    $state.go('future');
  }

  var TEAMTHROWBACKTWITTERID = '2554292761';

  var followThrowbackOnTwitter = function(index) {
    if (index == 2) {
      visitorFactory.handleAction("connect_twtr_follow_accept");

      // Follow Throwback on Twitter
      var twitterClient = OAuth.create('twitter');

      twitterClient.post('1.1/friendships/create.json', {
        data: {
          user_id: TEAMTHROWBACKTWITTERID,
          follow: true
        }
      }).
      done(function(response) {
        console.log(response);
      }).
      fail(function(error) {
        console.log(error);
      });

    } else {
      // User rejected follow
      visitorFactory.handleAction("connect_twtr_follow_reject");
      console.log('user rejected followThrowbackOnTwitter');
    }
  }

});
