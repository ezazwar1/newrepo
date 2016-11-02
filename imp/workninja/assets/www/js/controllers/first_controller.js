'use strict';

app.controller('FirstController', [
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

  $scope.login_modal = function() {
    //$rootScope.firstModal.hide().then(function() {
    $rootScope.firstModal.hide();
    $rootScope.loginModal.show();
    //});
  };

  $scope.signup_modal = function() {
    //$rootScope.firstModal.hide().then(function() {
    $rootScope.firstModal.hide();
    $rootScope.$broadcast('signupModalOpened');
    //$rootScope.$broadcast('signupClearForm');
    $rootScope.signupModal.show();
    //});
  };

  $scope.hideTerms = function() {
    $rootScope.termsModal.hide();
  };

  $scope.hidePolicy = function() {
    $rootScope.policyModal.hide();
  };

}]);
