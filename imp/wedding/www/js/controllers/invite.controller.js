angular.module('invite.controller', ['ngCordova'])
.controller('InviteCtrl', function($scope,$cordovaSocialSharing,$ionicPlatform,$cordovaGoogleAnalytics) {

$ionicPlatform.ready(function() {
    if (window.StatusBar) {
      $cordovaGoogleAnalytics.trackView('Invite Screen');
    }
  });
  

    $scope.url = $scope.invitationUrl;
    $scope.message = "Hey! You're invited to my wedding. View my wedding invitation here: "+$scope.url;
    //$scope.image = $scope.couplePhoto;
    $scope.image = null;
    //$scope.url = '';
    
    $scope.inviteTweet = function () {
      $scope.showInvite();
      setTimeout(function() {
        $scope.hide();
      }, 4000);
      $cordovaSocialSharing
        .shareViaTwitter($scope.message, $scope.image, $scope.url)
        .then(function(result) {
          // Success!
          console.log('Twitter invite finished - '.result);
          $scope.hide();
          $cordovaGoogleAnalytics.trackEvent('Invite', 'Twitter');
        }, function(err) {
          // An error occurred. Show a message to the user
          console.log('Twitter invite ERROR!! - '.err);
          $scope.hide();
        });
    }


    $scope.inviteWhatsapp = function () {
      $scope.showInvite();
      setTimeout(function() {
        $scope.hide();
      }, 4000);
      $cordovaSocialSharing
      .shareViaWhatsApp($scope.message, $scope.image, $scope.url)
      .then(function(result) {
        // Success!
        console.log('Whatsapp Invite finished - '.result);
        $cordovaGoogleAnalytics.trackEvent('Invite', 'WhatsApp');
        //$scope.hide();
      }, function(err) {
        // An error occurred. Show a message to the user
        console.log('Whatsapp Invite ERROR!! - '.err);
        //$scope.hide();
      });
    }

    $scope.inviteFacebook = function () {
      $scope.showInvite();
      setTimeout(function() {
        $scope.hide();
      }, 4000);
      $cordovaSocialSharing
      .shareViaFacebook($scope.message, $scope.image, $scope.url)
      .then(function(result) {
        // Success!
        console.log('Facebook Invite finished - '.result);
        $scope.hide();
        $cordovaGoogleAnalytics.trackEvent('Invite', 'Facebook');
      }, function(err) {
        // An error occurred. Show a message to the user
        console.log('Facebook Invite ERROR!! - '.err);
        $scope.hide();
      });
    }

    $scope.inviteSms = function () {
      $scope.showInvite();
      setTimeout(function() {
        $scope.hide();
      }, 4000);
      $cordovaSocialSharing
          .shareViaSMS($scope.message, null)
          .then(function(result) {
            // Success!
            $scope.hide();
            console.log('SMS Invite finished - '.result);
            $cordovaGoogleAnalytics.trackEvent('Invite', 'SMS');
          }, function(err) {
            // An error occurred. Show a message to the user
            $scope.hide();
            console.log('SMS Invite ERROR!! - '.err);
          });
    }

    $scope.inviteOther = function() {
      $scope.showInvite();
      setTimeout(function() {
        $scope.hide();
      }, 4000);
      window.plugins.socialsharing.share($scope.message);
        
    }

});