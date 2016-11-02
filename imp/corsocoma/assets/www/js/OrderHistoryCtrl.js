angular.module('ordersHistory.controller', [])

.controller('ordersHistoryListCtrl', function($scope, $location, $localstorage, $cordovaGoogleAnalytics, $ionicScrollDelegate, $ionicPosition) {
  /*Analytics Tracking START*/
  $scope.onTabSelected = function() {
    $state.go('tab.menu');
  };

  function _waitForAnalytics() {
    if (typeof analytics !== 'undefined') {
      $cordovaGoogleAnalytics.debugMode();
      $cordovaGoogleAnalytics.startTrackerWithId('UA-3423286-12');
      $cordovaGoogleAnalytics.trackView('Order History list');
    } else {
      setTimeout(function() {
        _waitForAnalytics();
      }, 250);
    }
  };
  _waitForAnalytics();
  $scope.haveData=false;
  $scope.total =0;
    if ($localstorage.getObject('ordersHistory') != null) {
      $scope.haveData=true;
      $scope.orders= $localstorage.getObject('ordersHistory');
    }
    if($localstorage.getObject('discountCardData') != null) {
      $scope.total = $localstorage.getObject('discountCardData').Total;
    }

})
