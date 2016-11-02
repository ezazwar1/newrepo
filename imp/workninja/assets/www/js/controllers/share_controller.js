'use strict';

app.controller('ShareController', [
  '$rootScope',
  '$scope',
  '$state',
  '$window',
  'Session',
function($rootScope, $scope, $state, $window, Session) {

  $scope.share = function() {
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.share(
        'Message',
        'Work Ninja',
        null,
        'http://workninja.com/'
      )
    }
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

  $scope.shareViaTwitter = function() {
    console.log('shareViaTwitter');
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.shareViaTwitter(
        'I just hired a Work Ninja! Thanks @goworkninja'  // message
      )
    }
  };

  $scope.shareViaFacebook = function() {
    console.log('shareViaFacebook');
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.shareViaFacebook(
        'I just hired a Work Ninja!',  // message
        null,  // img
        //'https://www.facebook.com/WorkNinja'  // link
        'http://workninja.com'  // link
      )
    }
  };

  $scope.shareViaEmail = function() {
    console.log('shareViaEmail');
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.shareViaEmail(
        'I just hired a <a href="http://workninja.com">Work Ninja</a>!',  // message
        'WorkNinja',  // subject
        null,
        'http://workninja.com/'
      )
    }
  };

  $scope.shareViaSms = function() {
    console.log('shareViaSms');
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.shareViaSMS(
        'I just hired a Work Ninja!',  // message
        null,
        function() {},  // success cb
        function() {}   // error cb
      )
    }
  };

}]);
