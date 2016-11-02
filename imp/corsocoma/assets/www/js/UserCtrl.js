angular.module('user.controller', [])
.controller('UserCtrl', function($scope, $location, $ionicHistory, $localstorage, $stateParams, $cordovaGoogleAnalytics, $ionicPlatform) {

  console.log('Start CustomerCtrl');
  /*Analytics Tracking START*/
  function _waitForAnalytics() {
    if (typeof analytics !== 'undefined') {
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
      $cordovaGoogleAnalytics.trackView('User');
    } else {
      setTimeout(function() {
        _waitForAnalytics();
      }, 250);
    }
  };
  _waitForAnalytics();
  /*Analytics Tracking END*/
  //начальные состояния иконок корзины и wishlist
  if ($localstorage.getObject('wishlist') === null) {
    $scope.wishlistStatusFull = 0;
    $scope.wishilistItems = 0;
  } else {
    $scope.wishlistStatusFull = 1;
    $scope.wishilistItems = $localstorage.getObject('wishlist').length;
  }
  if ($localstorage.getObject('shoppingCart') === null) {
    $scope.shoppingCartStatusFull = 0;
    $scope.cartItems = 0;
  } else {
    $scope.shoppingCartStatusFull = 1;
    $scope.cartItems = $localstorage.getObject('shoppingCart')['items'].length;

  }


  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  var account = $localstorage.getObject('account');
  if (account.customer_id == null) {
    $location.path("/tab/account");

  }

  $scope.account = $localstorage.getObject('account');
  $scope.logout = function() {
    $localstorage.deleteAll();
    $location.path("/tab/menu");
    $ionicHistory.clearHistory();
  };

})
