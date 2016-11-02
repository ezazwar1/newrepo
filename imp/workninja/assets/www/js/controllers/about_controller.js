"use strict";

app.controller('AboutController', [
  '$rootScope',
  '$scope',
  '$state',
  '$window',
  'CONFIG',
  'Session',
function($rootScope, $scope, $state, $window, CONFIG, Session) {

  if ($window.cordova) {
    $window.cordova.getAppVersion(function(version) {
      $scope.version = version;
    });
  }

  $scope.termsAndConditions = function() {
    $window.open(CONFIG.terms_and_conditions_url, '_system');
  };

  $scope.privacyPolicy = function() {
    $window.open(CONFIG.privacy_policy_url, '_system');
    //$window.open(CONFIG.privacy_policy_url, '_blank', 'location=yes');
  };
  $scope.goMain = function() {

    var currentUser = Session.currentUser;
    if (currentUser.isCustomer) {
      $rootScope.clearHistory();
      $state.go('app.customer.main');
    }
    else if (currentUser.isStaff) {
      $rootScope.clearHistory();
      $state.go('app.staff.main');
    }
  };

}]);
