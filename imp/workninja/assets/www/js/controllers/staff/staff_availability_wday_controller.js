'use strict';

app.controller('StaffAvailabilityWdayController', [
  '$scope',
  '$stateParams',
  '$state',
  '$window',
  'HOURS_OF_DAY',
  'DAYS_OF_WEEK',
  'staff',
function($scope, $stateParams, $state, $window, HOURS_OF_DAY, DAYS_OF_WEEK, staff) {

  //$scope.HOURS_OF_DAY = HOURS_OF_DAY;
  $scope.FROM_HOURS_OF_DAY = _.reject(HOURS_OF_DAY, function(h) {
    return h.id == 24;
  });
  $scope.TO_HOURS_OF_DAY = _.reject(HOURS_OF_DAY, function(h) {
    return h.id == 0;
  });

  //$scope.DAYS_OF_WEEK = _.reject(DAYS_OF_WEEK, function(d) {
  //  return d.id == 100;
  //});

  var wday = _.find(DAYS_OF_WEEK, function(w) {return w.id == $stateParams.wdayId});
  $scope.wdayName = wday.longName;
  $scope.availability = staff.availability[$stateParams.wdayId];

  $scope.isAnytime = function() {
    return $scope.availability && $scope.availability.available && $scope.availability.from == 0 && $scope.availability.to == 24;
  };

  $scope.toggleAnytime = function() {
    if ($scope.isAnytime()) {
      $scope.availability.from = 9;
      $scope.availability.to = 17;
    }
    else {
      $scope.availability.from = 0;
      $scope.availability.to = 24;
    }
  };

  //$scope.canUpdate = function() {
  //  return $scope.staff.hasAvailability() && $scope.staff.isAvailabilityValid();
  //};
  //
  //$scope.goMain = function() {
  //  $rootScope.clearHistory();
  //  $state.go('app.staff.main');
  //};
  //
  //$scope.update = function() {
  //  $scope.staff.$update().then(function() {
  //    $scope.goMain();
  //  });
  //}
    $scope.goOnboardAVT = function() {

        $state.go('app.staff.onboard5');

    };
}]);
