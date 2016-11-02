'use strict';

app.controller('LoginController', [
  '$rootScope',
  '$scope',
  '$state',
  '$window',
  'CONFIG',
  'Session',
  'Auth',
  'Event',
  'Location',
function($rootScope, $scope, $state, $window, CONFIG, Session, Auth, Event, Location) {

  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    Event.unsubscribeAll();
    Location.stopReporting();
    $rootScope.clearHistory();
    Session.currentUser = null;

    $scope.user = {
      email: null,
      password: null,
      scope: 'mobile'
    };
    $scope.message = null;

    $rootScope.firstModal.show();
  });

  $scope.goFirst = function() {
    $rootScope.firstModal.show();
    $rootScope.loginModal.hide();
  };

  $rootScope.$on('loginNew', function () {
    $scope.user.email = $rootScope.user_email;
    $scope.user.password = $rootScope.user_password;
    Auth.login($scope.user[0]);
  });

  $scope.login = function() {
    if ($window.cordova) {
      $window.cordova.plugins.Keyboard.close();
    }
    Auth.login($scope.user);
  };

  $scope.signup = function() {
    $window.open(CONFIG.signup_url, '_system');
    //$window.open(CONFIG.signup_url, '_blank', 'location=yes');
  };

  $scope.forgotPassword = function() {
    $window.open(CONFIG.forgot_password_url, '_system');
    //$window.open(CONFIG.forgot_password_url, '_blank', 'location=yes');   
    //https://go.workninja.com/password/reset
  };

  $scope.$on('event:auth-loginConfirmed', function() {
    $rootScope.loginModal.hide().then(function() {
       $rootScope.signupModal.hide();
      $scope.user = null;
      $scope.message = null;   
    });
  });

  $scope.$on('event:auth-loginFailed', function(e, status) {
    var error = "Login failed.";
    console.log('im retrying it');
    if (status == 401) {
      console.log('im retrying it');
      error = "Invalid email or password.";
      //retry it    
    }
    $scope.message = error;
  });

}]);
